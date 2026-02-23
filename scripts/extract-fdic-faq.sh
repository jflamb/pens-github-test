#!/usr/bin/env bash
set -euo pipefail

OUT_FILE="${1:-sites/fdic-public-information-faq/data.json}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

AURA_URL="https://ask.fdic.gov/fdicinformationandsupportcenter/s/sfsites/aura"
FWUID="SHNaWGp5QlJqZFZLVGR5N0w0d0tYUTJEa1N5enhOU3R5QWl2VzNveFZTbGcxMy4tMjE0NzQ4MzY0OC45OTYxNDcy"
APP_LOADED="1526_bpCZOEd6nrsbI-UTWwrzuw"

AURA_CONTEXT_BASE=$(jq -nc \
  --arg fwuid "$FWUID" \
  --arg loaded "$APP_LOADED" \
  '{mode:"PROD",fwuid:$fwuid,app:"siteforce:communityApp",loaded:{"APPLICATION@markup://siteforce:communityApp":$loaded},dn:[],globals:{},uad:true}')

AURA_CONTEXT_GET=$(jq -nc \
  --arg fwuid "$FWUID" \
  --arg loaded "$APP_LOADED" \
  '{mode:"PROD",fwuid:$fwuid,app:"siteforce:communityApp",loaded:{"APPLICATION@markup://siteforce:communityApp":$loaded},apck:"JHt0aW1lc3RhbXB9MDAwMDAwMTMzNjVlbl9VUw",uad:true}')

post_aura() {
  local query="$1"
  local message="$2"
  local page_uri="$3"

  curl -sS "${AURA_URL}?${query}" \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
    --data-urlencode "message=${message}" \
    --data-urlencode "aura.context=${AURA_CONTEXT_BASE}" \
    --data-urlencode "aura.pageURI=${page_uri}" \
    --data-urlencode 'aura.token=null'
}

get_aura() {
  local message="$1"

  curl -sS -G "${AURA_URL}" \
    --data-urlencode "message=${message}" \
    --data-urlencode "aura.context=${AURA_CONTEXT_GET}" \
    --data-urlencode 'aura.isAction=true'
}

mkdir -p "$(dirname "$OUT_FILE")"

TOPIC_MSG=$(jq -nc '{actions:[{id:"1;a",descriptor:"apex://TopicTreeController/ACTION$getTopicsString",callingDescriptor:"UNKNOWN",params:{communityPrefix:"fdicinformationandsupportcenter",currentPage:"public-information?language=en_US"},storable:true}]}' )

post_aura \
  'r=3&other.TopicTree.getTopicsString=1' \
  "$TOPIC_MSG" \
  '/fdicinformationandsupportcenter/s/public-information?language=en_US' \
  > "$TMP_DIR/topic_tree_response.json"

jq -r '.actions[0].returnValue' "$TMP_DIR/topic_tree_response.json" > "$TMP_DIR/topic_tree_raw.json"
jq '.' "$TMP_DIR/topic_tree_raw.json" > "$TMP_DIR/topic_tree.json"

jq -r '.. | objects | select(has("id") and has("name") and has("label") and has("href")) | [.id,.label,.name,.href] | @tsv' "$TMP_DIR/topic_tree.json" > "$TMP_DIR/topics.tsv"

: > "$TMP_DIR/topic_articles.ndjson"

while IFS=$'\t' read -r topic_id topic_label topic_name topic_href; do
  TREND_MSG=$(jq -nc --arg topic_id "$topic_id" '{actions:[{descriptor:"serviceComponent://ui.self.service.components.controller.TopicTrendingArticleListDataProviderController/ACTION$getTrendingArticles",callingDescriptor:"markup://selfService:topicTrendingArticlesDataProvider",params:{topicId:$topic_id,limit:25,clientLanguage:"en_US"},version:"66.0",storable:true}]}' )

  get_aura "$TREND_MSG" > "$TMP_DIR/topic_${topic_id}.json"

  jq -c --arg topic_id "$topic_id" --arg topic_label "$topic_label" '
    .actions[0].returnValue[]? | {
      id,
      urlName,
      title,
      summary,
      topicId:$topic_id,
      topicLabel:$topic_label
    }
  ' "$TMP_DIR/topic_${topic_id}.json" >> "$TMP_DIR/topic_articles.ndjson"
done < "$TMP_DIR/topics.tsv"

jq -s '
  group_by(.id)
  | map({
      id: .[0].id,
      urlName: .[0].urlName,
      title: .[0].title,
      summary: .[0].summary,
      topics: (map({id:.topicId,label:.topicLabel}) | unique_by(.id))
    })
  | sort_by(.title)
' "$TMP_DIR/topic_articles.ndjson" > "$TMP_DIR/articles_compact.json"

jq -r '.[].id' "$TMP_DIR/articles_compact.json" > "$TMP_DIR/article_ids.txt"

: > "$TMP_DIR/article_details.ndjson"

while IFS= read -r article_id; do
  [ -z "$article_id" ] && continue

  SEO_MSG=$(jq -nc --arg article_id "$article_id" '{actions:[{id:"1;a",descriptor:"serviceComponent://ui.communities.components.aura.components.forceCommunity.seoAssistant.SeoAssistantController/ACTION$getRecordAndTranslationData",callingDescriptor:"markup://forceCommunity:seoAssistant",params:{recordId:$article_id,fields:["Summary","Description__c","Title"],activeLanguageCodes:["en_US","es"]},version:"66.0"}]}' )

  post_aura \
    'r=77&ui-communities-components-aura-components-forceCommunity-seoAssistant.SeoAssistant.getRecordAndTranslationData=1' \
    "$SEO_MSG" \
    '/fdicinformationandsupportcenter/s/article?language=en_US' \
    > "$TMP_DIR/article_${article_id}.json"

  jq -c --arg article_id "$article_id" '
    .actions[0].returnValue.RecordData as $r
    | {
        id: $article_id,
        title: ($r.Title // $r._Title),
        summary: ($r.Summary // ""),
        descriptionHtml: ($r.Description__c // "")
      }
  ' "$TMP_DIR/article_${article_id}.json" >> "$TMP_DIR/article_details.ndjson"
done < "$TMP_DIR/article_ids.txt"

jq -s '
  map({key:.id, value:.}) | from_entries
' "$TMP_DIR/article_details.ndjson" > "$TMP_DIR/article_details_map.json"

jq -n \
  --arg sourceUrl "https://ask.fdic.gov/fdicinformationandsupportcenter/s/public-information?language=en_US" \
  --arg generatedAt "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --slurpfile categories "$TMP_DIR/topic_tree.json" \
  --slurpfile articles "$TMP_DIR/articles_compact.json" \
  --slurpfile detailMap "$TMP_DIR/article_details_map.json" '
  {
    sourceUrl: $sourceUrl,
    generatedAt: $generatedAt,
    categories: $categories[0],
    articles: (
      $articles[0]
      | map(
          . as $a
          | ($detailMap[0][$a.id] // {}) as $d
          | {
              id: $a.id,
              urlName: $a.urlName,
              question: ($d.title // $a.title),
              summary: ($d.summary // $a.summary // ""),
              answerHtml: ($d.descriptionHtml // ""),
              topics: $a.topics
            }
        )
      | sort_by(.question)
    )
  }
' > "$OUT_FILE"

echo "Wrote ${OUT_FILE}"

#!/bin/bash

# 博客图片本地化脚本
# 下载所有外部图片到本地，并更新文章引用

set -e

BLOG_DIR="/Users/ryan/Home/coding/onemason"
POSTS_DIR="$BLOG_DIR/source/_posts"
IMAGES_DIR="$BLOG_DIR/source/images/posts"
LOG_FILE="$BLOG_DIR/image-localization.log"

# 创建日志文件
echo "=== 博客图片本地化开始于 $(date) ===" > "$LOG_FILE"

# 创建图片目录
mkdir -p "$IMAGES_DIR"

# 提取所有图片链接
echo "提取所有图片链接..." | tee -a "$LOG_FILE"
grep -r "!\[" "$POSTS_DIR" | grep -o "http[^)]*" | grep -i "\.\(jpg\|jpeg\|png\|gif\|svg\|webp\)" | sort -u > /tmp/all-image-urls.txt

IMAGE_COUNT=$(wc -l < /tmp/all-image-urls.txt)
echo "找到 $IMAGE_COUNT 个外部图片链接" | tee -a "$LOG_FILE"

# 下载计数器
DOWNLOADED=0
SKIPPED=0
FAILED=0

# 下载每个图片
echo "开始下载图片..." | tee -a "$LOG_FILE"
while IFS= read -r IMAGE_URL; do
    # 从URL提取文件名
    # 移除查询参数
    CLEAN_URL="${IMAGE_URL%%\?*}"
    # 获取文件名
    FILENAME=$(basename "$CLEAN_URL")
    # 清理文件名（移除特殊字符）
    SAFE_FILENAME=$(echo "$FILENAME" | sed 's/[^a-zA-Z0-9._-]/_/g')

    # 生成唯一文件名（避免重复）
    UNIQUE_FILENAME="$SAFE_FILENAME"
    COUNTER=1
    while [[ -f "$IMAGES_DIR/$UNIQUE_FILENAME" ]]; do
        BASE_NAME="${SAFE_FILENAME%.*}"
        EXTENSION="${SAFE_FILENAME##*.}"
        UNIQUE_FILENAME="${BASE_NAME}_${COUNTER}.${EXTENSION}"
        ((COUNTER++))
    done

    LOCAL_PATH="images/posts/$UNIQUE_FILENAME"

    echo "处理: $IMAGE_URL" >> "$LOG_FILE"
    echo "保存为: $UNIQUE_FILENAME" >> "$LOG_FILE"

    # 下载图片
    if curl -s -L -o "$IMAGES_DIR/$UNIQUE_FILENAME" "$IMAGE_URL" 2>/dev/null; then
        # 检查文件是否有效（非空且是图片）
        if [[ -s "$IMAGES_DIR/$UNIQUE_FILENAME" ]] && file "$IMAGES_DIR/$UNIQUE_FILENAME" | grep -q "image"; then
            echo "✓ 下载成功: $UNIQUE_FILENAME" | tee -a "$LOG_FILE"

            # 更新所有引用此图片的文章
            grep -l "$IMAGE_URL" "$POSTS_DIR"/*/*.md 2>/dev/null | while read -r ARTICLE; do
                echo "  更新文章: $(basename "$ARTICLE")" >> "$LOG_FILE"
                # 转义URL中的特殊字符用于sed
                ESCAPED_URL=$(echo "$IMAGE_URL" | sed 's/[\/&]/\\&/g')
                sed -i '' "s|$ESCAPED_URL|/$LOCAL_PATH|g" "$ARTICLE"
            done

            ((DOWNLOADED++))
        else
            echo "✗ 无效的图片文件: $UNIQUE_FILENAME" | tee -a "$LOG_FILE"
            rm -f "$IMAGES_DIR/$UNIQUE_FILENAME"
            ((FAILED++))
        fi
    else
        echo "✗ 下载失败: $IMAGE_URL" | tee -a "$LOG_FILE"
        ((FAILED++))
    fi

    # 避免请求过快
    sleep 0.5

done < /tmp/all-image-urls.txt

# 统计结果
echo "" | tee -a "$LOG_FILE"
echo "=== 下载完成 ===" | tee -a "$LOG_FILE"
echo "成功下载: $DOWNLOADED" | tee -a "$LOG_FILE"
echo "下载失败: $FAILED" | tee -a "$LOG_FILE"
echo "跳过: $SKIPPED" | tee -a "$LOG_FILE"

# 检查是否还有外部链接
echo "" | tee -a "$LOG_FILE"
echo "=== 检查剩余的外部图片链接 ===" | tee -a "$LOG_FILE"
REMAINING=$(grep -r "!\[" "$POSTS_DIR" | grep -c "http[s]*://" || true)
if [[ "$REMAINING" -gt 0 ]]; then
    echo "警告: 还有 $REMAINING 个外部图片链接" | tee -a "$LOG_FILE"
    grep -r "!\[" "$POSTS_DIR" | grep "http[s]*://" | head -5 >> "$LOG_FILE"
else
    echo "✓ 所有图片链接已本地化" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "本地图片存储位置: $IMAGES_DIR" | tee -a "$LOG_FILE"
echo "日志文件: $LOG_FILE" | tee -a "$LOG_FILE"
echo "=== 脚本执行完成于 $(date) ===" | tee -a "$LOG_FILE"
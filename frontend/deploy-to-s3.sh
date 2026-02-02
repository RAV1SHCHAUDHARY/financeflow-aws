#!/bin/bash

# FinanceFlow Pro - S3 Deployment Script
# This script builds and deploys your frontend to AWS S3 + CloudFront

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
S3_BUCKET="financeflow-pro-frontend"  # Change this to your bucket name
CLOUDFRONT_DISTRIBUTION_ID=""  # Add your CloudFront distribution ID here

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FinanceFlow Pro - S3 Deployment Script     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI configured${NC}"
echo ""

# Step 1: Build the app
echo -e "${BLUE}📦 Building React app...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 2: Upload to S3
echo -e "${BLUE}☁️  Uploading to S3 bucket: ${S3_BUCKET}${NC}"
aws s3 sync dist/ s3://${S3_BUCKET}/ --delete --cache-control "max-age=31536000,public"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload successful${NC}"
else
    echo -e "${RED}❌ Upload failed${NC}"
    exit 1
fi
echo ""

# Step 3: Invalidate CloudFront cache (if distribution ID is set)
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/*" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Cache invalidation started${NC}"
    else
        echo -e "${RED}❌ Cache invalidation failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  CloudFront distribution ID not set. Skipping cache invalidation.${NC}"
    echo -e "${YELLOW}   Add your distribution ID to this script to enable cache invalidation.${NC}"
fi
echo ""

# Get S3 website URL
S3_WEBSITE_URL="http://${S3_BUCKET}.s3-website-us-east-1.amazonaws.com"

echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🎉 Deployment Complete! 🎉          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 S3 Website URL:${NC}"
echo -e "   ${S3_WEBSITE_URL}"
echo ""
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${BLUE}📍 CloudFront URL:${NC}"
    echo -e "   https://${CLOUDFRONT_DISTRIBUTION_ID}.cloudfront.net"
    echo ""
    echo -e "${YELLOW}⏳ Cache invalidation takes 1-2 minutes to complete${NC}"
fi
echo ""
echo -e "${GREEN}✨ Your app is now live!${NC}"
set profile=dursin_personal
set bucket=cookoff-web
set distribution_id=E1DPCWO5TSNTFL

aws s3 sync ./build s3://%bucket% --delete --profile=%profile% --region=us-east-1

aws cloudfront create-invalidation --distribution-id=%distribution_id% --paths="/*"  --region=us-east-1 --profile=%profile%
set profile=dursin_personal
set bucket=cookoff-web

aws s3 sync ./build s3://%bucket% --delete --profile=%profile% --region=us-east-1
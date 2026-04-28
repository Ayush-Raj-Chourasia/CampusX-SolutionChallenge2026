#!/bin/sh
# This script injects Cloud Run environment variables into the frontend

export VITE_API_URL=${VITE_API_URL:-"http://localhost:5000"}

# Create a JSON config file that the frontend can read
cat > /app/dist/config.json <<EOF
{
  "apiUrl": "$VITE_API_URL"
}
EOF

echo "Frontend config:"
echo "  API URL: $VITE_API_URL"

# Start the serve process
exec serve -s dist -l 3000

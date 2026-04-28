#!/bin/sh
# This script injects Cloud Run environment variables into the frontend

export VITE_API_URL=${VITE_API_URL:-"http://localhost:5000"}
export PORT=${PORT:-3000}

# Create a JSON config file that the frontend can read
cat > /app/dist/config.json <<EOF
{
  "apiUrl": "$VITE_API_URL"
}
EOF

echo "Frontend config:"
echo "  API URL: $VITE_API_URL"
echo "  Port: $PORT"

# Start the serve process on the configured port
exec serve -s dist -l $PORT

#!/usr/bin/env fish

# Start the Flask server
echo "Starting Flask server..."
python api/app.py &

# Wait a moment to ensure Flask server has started
sleep 2

# Start the npm server
echo "Starting npm server..."
npm run dev &

# Wait for both processes
wait

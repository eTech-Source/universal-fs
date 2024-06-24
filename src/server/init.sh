#!/bin/bash
# This script must be run in dist

FILE_NAME="./dist/index.js"

check_node() {
    node -v >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "Node.js is not installed. Please install Node.js to proceed."
        exit 1
    fi
}


run_file() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        node "$1"
    elif [[ "$OSTYPE" == "linux-gnu" ]]; then
        # Linux
        node "$1"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        # Windows using Git Bash or similar
        node "$1"
    else
        echo "Unsupported OS: $OSTYPE"
        exit 1
    fi
}

check_node


run_file "$FILE_NAME"

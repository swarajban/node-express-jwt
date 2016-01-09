#!/usr/bin/env bash

echo "Installing node modules for authority server..."
(cd authority && npm install)
echo "...done"

echo "Installing node modules for consumer server..."
(cd consumer && npm install)
echo "...done"

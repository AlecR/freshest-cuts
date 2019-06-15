#!/bin/sh

COMPONENT_NAME="$1"
echo "Creating $1"

cd ../src/Components/
mkdir "./$COMPONENT_NAME"
cd "./$COMPONENT_NAME"

echo "Generating COMPONENT_NAME at ./src/Components/$COMPONENT_NAME"

cat >index.jsx <<EOL
import React, { Component } from 'react';
import './$COMPONENT_NAME.css';

export default class $COMPONENT_NAME extends Component {
  render() {
    return(
      <div>
        <h1>Hello World - $COMPONENT_NAME component</h1>
      </div>
    )
  }
}
EOL
echo "Generated index.jsx"

cat >$COMPONENT_NAME.css <<EOL
/* Add custom module styles here */
EOL
echo "Generated $COMPONENT_NAME.css"
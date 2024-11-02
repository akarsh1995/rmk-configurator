import React from "react"
import { JsonEditor, JsonEditorProps } from "json-edit-react"


const JSONEditor = (props: React.JSX.IntrinsicAttributes & JsonEditorProps) => {
  return <JsonEditor {...props}/ >
} 

export default JSONEditor;

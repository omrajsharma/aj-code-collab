import CodeMirror from 'codemirror';
import React, { useEffect, useRef } from 'react'
import { ACTIONS } from '../Actions';
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";

const Editor = ({socketRef, roomId, onCodeChange}) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const editor = CodeMirror.fromTextArea(
                document.getElementById("realtimeEditor"),
                {
                    mode: { name: 'javascript', json: true},
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true
                }
            );

            editorRef.current = editor;
            editor.setSize(null, "100%");
            editorRef.current.on("change", (instance, changes) => {
                const {origin} = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if(origin != "setValue") {
                    socketRef.current.emit(
                        ACTIONS.CODE_CHANGE, {
                            roomId,
                            code
                        }
                    )
                }
            })
        };

        init();
    }, [])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
                if (code != null) {
                    editorRef.current.setValue(code);
                }
            })
        }
    }, [socketRef.current])

  return (
    <div style={{height: "600px"}}>
        <textarea id='realtimeEditor'></textarea>
    </div>
  )
}

export default Editor
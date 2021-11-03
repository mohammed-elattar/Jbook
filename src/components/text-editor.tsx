import React, { useState, useRef, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css';
import { Cell } from '../state';
import useActions from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}
const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    window.addEventListener('click', listener, { capture: true });
    return () => {
      window.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div ref={ref} className='text-editor'>
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || '')}
        />
      </div>
    );
  }

  return (
    <div onClick={() => setEditing(true)} className='text-editor card'>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};

export default TextEditor;

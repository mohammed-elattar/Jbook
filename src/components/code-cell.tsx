import { useEffect, useState } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';
import { Cell } from '../state';
import useActions from '../hooks/use-actions';

interface CodeCellProps {
  cell: Cell;
}
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content);
      setCode(output.code);
      setCode(output.error);
    }, 750);
    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;

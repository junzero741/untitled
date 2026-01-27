'use client';

import React, { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';
import './editor.css';

interface ProseMirrorEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

// 리스트를 포함한 스키마 생성
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

/**
 * ProseMirror 기반 WYSIWYG 에디터 컴포넌트
 * 
 * 주요 기능:
 * - 텍스트 서식 (굵게, 기울임, 코드)
 * - 제목 (Heading 1-3)
 * - 리스트 (순서 있는 리스트, 순서 없는 리스트)
 * - 실행 취소/다시 실행
 */
export function ProseMirrorEditor({ content = '', onChange, placeholder = '내용을 입력하세요...' }: ProseMirrorEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // 초기 문서 생성
    let doc;
    if (content) {
      const parser = DOMParser.fromSchema(mySchema);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      doc = parser.parse(tempDiv);
    } else {
      doc = mySchema.node('doc', null, [
        mySchema.node('paragraph', null, []),
      ]);
    }

    // 키맵 설정
    const customKeymap = keymap({
      'Mod-z': undo,
      'Mod-y': redo,
      'Mod-Shift-z': redo,
      'Mod-b': toggleMark(mySchema.marks.strong),
      'Mod-i': toggleMark(mySchema.marks.em),
      'Mod-`': toggleMark(mySchema.marks.code),
      ...baseKeymap,
    });

    // EditorState 생성
    const state = EditorState.create({
      doc,
      plugins: [
        history(),
        customKeymap,
      ],
    });

    // EditorView 생성
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        // 내용이 변경되었을 때 콜백 호출
        if (transaction.docChanged && onChange) {
          const serializer = DOMSerializer.fromSchema(mySchema);
          const fragment = serializer.serializeFragment(newState.doc.content);
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(fragment);
          onChange(tempDiv.innerHTML);
        }
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  // 툴바 버튼 핸들러
  const handleBold = () => {
    if (!viewRef.current) return;
    const command = toggleMark(mySchema.marks.strong);
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleItalic = () => {
    if (!viewRef.current) return;
    const command = toggleMark(mySchema.marks.em);
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleCode = () => {
    if (!viewRef.current) return;
    const command = toggleMark(mySchema.marks.code);
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleHeading = (level: 1 | 2 | 3) => {
    if (!viewRef.current) return;
    const command = setBlockType(mySchema.nodes.heading, { level });
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleParagraph = () => {
    if (!viewRef.current) return;
    const command = setBlockType(mySchema.nodes.paragraph);
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleBulletList = () => {
    if (!viewRef.current) return;
    const command = wrapIn(mySchema.nodes.bullet_list);
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleOrderedList = () => {
    if (!viewRef.current) return;
    const command = wrapIn(mySchema.nodes.ordered_list);
    command(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleUndo = () => {
    if (!viewRef.current) return;
    undo(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  const handleRedo = () => {
    if (!viewRef.current) return;
    redo(viewRef.current.state, viewRef.current.dispatch);
    viewRef.current.focus();
  };

  return (
    <div className="prosemirror-editor-wrapper">
      {/* 툴바 */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={handleUndo}
            className="toolbar-button"
            title="실행 취소 (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={handleRedo}
            className="toolbar-button"
            title="다시 실행 (Ctrl+Y)"
          >
            ↷
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => handleHeading(1)}
            className="toolbar-button"
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => handleHeading(2)}
            className="toolbar-button"
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => handleHeading(3)}
            className="toolbar-button"
            title="제목 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={handleParagraph}
            className="toolbar-button"
            title="본문"
          >
            P
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            type="button"
            onClick={handleBold}
            className="toolbar-button"
            title="굵게 (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={handleItalic}
            className="toolbar-button"
            title="기울임 (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={handleCode}
            className="toolbar-button"
            title="코드 (Ctrl+`)"
          >
            {'</>'}
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group">
          <button
            type="button"
            onClick={handleBulletList}
            className="toolbar-button"
            title="순서 없는 리스트"
          >
            • List
          </button>
          <button
            type="button"
            onClick={handleOrderedList}
            className="toolbar-button"
            title="순서 있는 리스트"
          >
            1. List
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div ref={editorRef} className="editor-content" data-placeholder={placeholder} />
    </div>
  );
}

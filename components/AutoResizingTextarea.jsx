import { useEffect, useRef } from 'react';

export default function AutoResizingTextarea({ value, onChange, className = '', ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {if (textareaRef.current){ textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; }},[value]);

  return ( <textarea ref={textareaRef} value={value} onChange={onChange} className={`resize-none overflow-hidden ${className}`} {...props} /> );
}

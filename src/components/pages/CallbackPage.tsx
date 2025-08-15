import React, { useState, useCallback } from "react";

const Child = ({ onClick }: { onClick: () => void }) => {
  console.log("🔁 Child rendered (with heavy calc)");

  // 重い処理を模倣
  const start = performance.now();
  while (performance.now() - start < 300) {} // 300ms止まる

  return (
    <div>
      <button onClick={onClick}>Child Button</button>
    </div>
  );
};

const CallbackPage = () => {
  const [parentCount, setParentCount] = useState(0);
  const [childClickCount, setChildClickCount] = useState(0);

  // 🔴 useCallbackなしだと、親が再レンダリングするたびに関数が新しくなる
  const handleChildClick = () => {
    setChildClickCount((c) => c + 1);
  };

  // 🟢 useCallbackを使うと、childClickCountが変わらない限り同じ関数インスタンス
  // const handleChildClick = useCallback(() => {
  //   setChildClickCount((c) => c + 1);
  // }, []);

  return (
    <div>
      <h2>useCallback デモ</h2>
      <p>親のカウント: {parentCount}</p>
      <p>子のクリック回数: {childClickCount}</p>

      <button onClick={() => setParentCount((c) => c + 1)}>親を更新</button>

      <hr />

      <Child onClick={handleChildClick} />
    </div>
  );
};

export default CallbackPage;

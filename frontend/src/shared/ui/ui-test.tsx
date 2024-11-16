import React from 'react';

export function UiTest(): React.ReactNode {
  // Добавим хендлер для события, зарегистрированного на фазе захвата.
  function handleCaptureClick() {
    console.log('Что-то мне подсказывает, что на кнопку сейчас надавят...');
  }

  function handleClickBubble() {
    console.log('Поймаю событие после handleAgressiveButtonClick!');
  }

  function handleAgressiveButtonClick() {
    console.log('Не дави на меня!');
  }

  return (
    <div onClick={handleClickBubble} onClickCapture={handleCaptureClick}>
      <button onClick={handleAgressiveButtonClick}>Тестовая кнопка!</button>
    </div>
  );
}

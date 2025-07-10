import { useState } from "react";
import data from "../../Context/ContextAPI";
import "./EmojiArea.css";

function EmojiArea() {
  const [activeState, setActiveState] = useState(null);

  return (
    <>
      <div className="emoji-area">
        <ul>
          {data.emojis.map((emoji, index) => (
            <li key={index}>
              <img src={emoji}
              className={activeState == index ? 'active' : ''}
              onClick={() => setActiveState(index)}
              alt="" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default EmojiArea;

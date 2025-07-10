import { useState } from "react";
import data from "../../Context/ContextAPI";
import "./EmojiArea.css";
import NavBar from "../NavBar/NavBar"

const emojiGenreMap = {
  0: 35,   
  1: 18,   
  2: 16,   
  3: 878,  
  4: 10749,
  5: 27   
};

function EmojiArea({ onSelectGenre }) {
  const [activeState, setActiveState] = useState(null);

  const handleEmojiClick = (index) => {
    setActiveState(index);
    onSelectGenre(emojiGenreMap[index]);
  };

  return (
    <>
    <NavBar />
    <div className="emoji-area">
      <ul>
        {data.emojis.map((emoji, index) => (
          <li key={index}>
            <img
              src={emoji}
              className={activeState === index ? "active" : ""}
              onClick={() => handleEmojiClick(index)}
              alt=""
            />
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default EmojiArea; 
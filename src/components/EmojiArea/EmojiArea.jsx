import { useState } from "react";
import data from "../../Context/ContextAPI";
import "./EmojiArea.css";

// Mapping index to genre ID
const emojiGenreMap = {
  0: 35,   // Happy → Comedy
  1: 18,   // Sad → Drama
  2: 16,   // Funny → Animation
  3: 878,  // MindBlowing → Science Fiction
  4: 10749,// Romantic → Romance
  5: 27    // Scary → Horror
};

function EmojiArea({ onSelectGenre }) {
  const [activeState, setActiveState] = useState(null);

  const handleEmojiClick = (index) => {
    setActiveState(index);
    onSelectGenre(emojiGenreMap[index]);
  };

  return (
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
  );
}

export default EmojiArea; 
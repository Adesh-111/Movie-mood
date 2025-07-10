# MovieMood

MovieMood is a modern movie discovery web app that helps you find movies to match your mood, genre, or language preferences, with a awesome UI. It features infinite scroll, background trailer playback with sound toggle, emoji-based genre picking, advanced filtering, and more.

## Features

- 🎬 **Browse Latest, Genre, or Searched Movies:** Instantly discover recent movies, search by title, or explore by mood/genre.
- 🚀 **Infinite Scroll:** Loads more movies as you scroll. Supports both normal (down) and reverse (up) scroll modes.
- 🎥 **Background Trailer Playback:** Movie detail pages feature an auto-playing, muted trailer video in the background (YouTube-powered), with a toggle for sound on/off (like Netflix).
- 🎭 **Emoji Mood Picker:** Choose genres/moods using friendly emoji.
- ⭐ **Filtering & Sorting:** Filter by rating, language, and sort by release date, rating, popularity.
- 🌐 **Language Selection:** Quickly browse movies in English, Hindi, and many other languages.
- 👥 **Cast, Reviews, and Similar Movies:** See cast members, user reviews, and similar movies for each detail page.
- 📱 **Responsive Design:** Looks great on desktop and mobile.
- ⚡ **Performance Optimized:** Only loads what's needed, with smooth UX.

## Screenshots



## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- A [TMDb API Key](https://www.themoviedb.org/documentation/api)

### Installation

1. **Clone the repo:**
    ```bash
    git clone https://github.com/yourusername/MovieMood.git
    cd MovieMood
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up TMDb API key:**

    Create a `.env` file in the root directory and add:

    ```
    VITE_API_KEY=your_tmdb_api_key_here
    ```

4. **Start the development server:**
    ```bash
    npm run dev
    ```
    The app will usually be available at [http://localhost:5173](http://localhost:5173) (for Vite), or as configured.

## Project Structure

```
src/
  components/
    EmojiArea/
    MoviesArea/
    MovieDetailPage/
  Context/
    ContextAPI.js
  api/
    movieApi.js
  App.js
  main.js
  ...
public/
  ...
README.md
```

- **MoviesArea/** – The main movie browser and infinite scroll UI.
- **MovieDetailPage/** – Movie detail with background trailer and info.
- **EmojiArea/** – Mood/genre emoji picker.
- **ContextAPI.js** – App-wide context and icons.
- **movieApi.js** – TMDb API integration.

## How It Works

- Uses the [TMDb](https://www.themoviedb.org/) API for all movie, genre, and video data.
- Infinite scroll is implemented for both default and filtered/search views.
- YouTube trailers are displayed in the background using the YouTube IFrame API, with sound toggle (mute/unmute) that does **not** restart the video.
- Emoji genre picker updates the movie list based on mood.
- Filtering and sorting update the displayed movie list in real-time.

## Customization

- You can add/remove languages in `importantLanguages` in `MoviesArea.js`.
- To change emoji or genres: edit `EmojiArea.js`.
- To style the app, edit the CSS files in each component folder.

## Deployment

You can deploy MovieMood to Vercel, Netlify, or any static host. Just build with:

```bash
npm run build
```

and deploy the output in the `dist/` folder.

## Credits

- [TMDb API](https://www.themoviedb.org/documentation/api) for movie data
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) for trailer playback
- All open-source contributors and icon sources

## License

MIT

## Developer

- [Adesh D](https://adesh-dev.vercel.app)

---

**Happy movie hunting with MovieMood!**

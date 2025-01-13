import React, { useState } from "react";
import "./Converter.css";

// Spotify 플레이리스트 데이터 가져오기
const fetchSpotifyPlaylist = async (playlistLink) => {
  try {
    const playlistId = playlistLink.split("/").pop().split("?")[0]; // Spotify 플레이리스트 ID 추출
    const apiUrl = `http://localhost:5001/spotify/playlist?id=${playlistId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error("Failed to fetch Spotify playlist data");

    return await response.json(); // Spotify API에서 받은 플레이리스트 데이터 반환
  } catch (error) {
    console.error(error);
    alert("Spotify 플레이리스트를 가져오는 중 오류가 발생했습니다.");
    return null;
  }
};

// Playlist 변환 API 호출
const convertPlaylist = async (source, destination, playlistData) => {
    if (!playlistData || !playlistData.tracks) {
      console.error("Invalid playlist data:", playlistData);
      alert("Playlist data is invalid.");
      return null;
    }
  
    try {
      console.log("Sending playlist data for conversion:", playlistData);
  
      const apiUrl = "http://localhost:5001/convert";
      const payload = {
        sourcePlatform: source,
        destinationPlatform: destination,
        playlistData, // 플레이리스트 데이터를 그대로 전달
      };
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to convert the playlist");
  
      const result = await response.json();
      console.log("Received converted links:", result);
  
      return result;
    } catch (error) {
      console.error("Error during playlist conversion:", error);
      alert("Failed to convert playlist. Please try again.");
      return null;
    }
  };

function Converter() {
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [destinationPlatform, setDestinationPlatform] = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [playlistData, setPlaylistData] = useState(null);
  const [convertedLink, setConvertedLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Spotify 플레이리스트 가져오기
  const handleFetchPlaylist = async () => {
    if (!playlistLink) {
      alert("플레이리스트 링크를 입력해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 상태 시작
    try {
      const data = await fetchSpotifyPlaylist(playlistLink);
      if (data) {
        setPlaylistData(data); // 가져온 플레이리스트 데이터를 상태로 저장
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // Playlist 변환하기
  const handleConvertPlaylist = async () => {
    if (!sourcePlatform || !destinationPlatform || !playlistData) {
      alert("Please provide all required inputs.");
      return;
    }
  
    setIsLoading(true); // 로딩 상태 시작
    try {
      console.log("Initiating playlist conversion...");
      const result = await convertPlaylist(sourcePlatform, destinationPlatform, playlistData);
  
      if (result && result.convertedLinks) {
        console.log("Converted links:", result.convertedLinks);
        setConvertedLink(result.convertedLinks.join(", ")); // 여러 링크를 문자열로 결합
      } else {
        console.error("Failed to retrieve converted links.");
        alert("Failed to retrieve converted links.");
      }
    } catch (error) {
      console.error("Error in handleConvertPlaylist:", error);
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="converter-container">
      <h1>Playlist Converter</h1>

      {/* Source Platform 선택 */}
      <div className="converter-input-group">
        <label className="converter-label">
          Source Platform:{" "}
          <select
            value={sourcePlatform}
            onChange={(e) => setSourcePlatform(e.target.value)}
            className="converter-select"
          >
            <option value="">Select a platform</option>
            <option value="spotify">Spotify</option>
            <option value="youtube">YouTube</option>
            <option value="apple-music">Apple Music</option>
            <option value="tidal">Tidal</option>
          </select>
        </label>
      </div>

      {/* Destination Platform 선택 */}
      <div className="converter-input-group">
        <label className="converter-label">
          Destination Platform:{" "}
          <select
            value={destinationPlatform}
            onChange={(e) => setDestinationPlatform(e.target.value)}
            className="converter-select"
          >
            <option value="">Select a platform</option>
            <option value="spotify">Spotify</option>
            <option value="youtube">YouTube</option>
            <option value="apple-music">Apple Music</option>
            <option value="tidal">Tidal</option>
          </select>
        </label>
      </div>

      {/* Playlist Link 입력 */}
      <div className="converter-input-group">
        <label className="converter-label">
          Playlist Link:{" "}
          <input
            type="text"
            value={playlistLink}
            onChange={(e) => setPlaylistLink(e.target.value)}
            placeholder="Enter your playlist link"
            className="converter-input"
          />
        </label>
      </div>

      {/* 플레이리스트 가져오기 버튼 */}
      <button
        onClick={handleFetchPlaylist}
        className="converter-button"
        disabled={isLoading}
      >
        {isLoading ? "Fetching..." : "Fetch Playlist"}
      </button>

      {/* 플레이리스트 정보 출력 */}
      {playlistData && (
        <div className="playlist-info">
          <h3>Playlist: {playlistData.name}</h3>
          <ul>
            {playlistData.tracks.map((track, index) => (
              <li key={index}>
                {track.name} by {track.artist}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 변환 버튼 */}
      {playlistData && (
        <button
          onClick={handleConvertPlaylist}
          className="converter-button"
          disabled={isLoading}
        >
          {isLoading ? "Converting..." : "Convert Playlist"}
        </button>
      )}

      {/* 변환된 링크 출력 */}
      {convertedLink && (
        <div className="converter-link">
          <h3>Converted Link:</h3>
          <a href={convertedLink} target="_blank" rel="noopener noreferrer">
            {convertedLink}
          </a>
        </div>
      )}
    </div>
  );
}

export default Converter;
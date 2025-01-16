import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google"; // Google OAuth hook
import "./Converter.css";

// 플랫폼별 플레이리스트 데이터 가져오기
const fetchPlaylistData = async (sourcePlatform, playlistLink) => {
  try {
    if (!playlistLink) throw new Error("Playlist link is missing.");
    let apiUrl = "";

    switch (sourcePlatform) {
      case "spotify":
        const playlistId = playlistLink.split("/").pop().split("?")[0]; // Spotify 플레이리스트 ID 추출
        apiUrl = `http://localhost:5001/spotify/playlist?id=${playlistId}`;
        break;
      case "youtube":
        throw new Error("YouTube as source platform is not yet supported.");
      default:
        throw new Error("Unsupported platform.");
    }

    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error("Failed to fetch playlist data");

    return await response.json(); // 플랫폼 API에서 받은 플레이리스트 데이터 반환
  } catch (error) {
    console.error(error);
    alert("플레이리스트를 가져오는 중 오류가 발생했습니다.");
    return null;
  }
};

// Playlist 변환 API 호출
const convertPlaylist = async (sourcePlatform, destinationPlatform, playlistData, googleAccessToken) => {
  if (!playlistData || !playlistData.tracks) {
    alert("Playlist data is invalid.");
    return null;
  }

  try {
    const apiUrl = "http://localhost:5001/convert";
    const payload = {
      sourcePlatform,
      destinationPlatform,
      playlistData,
      googleAccessToken,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to convert the playlist");

    return await response.json();
  } catch (error) {
    console.error("Error during playlist conversion:", error);
    alert("Failed to convert playlist. Please try again.");
    return null;
  }
};

function Converter() {
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [destinationPlatform] = useState("youtube"); // YouTube로 변환 고정
  const [playlistLink, setPlaylistLink] = useState("");
  const [playlistData, setPlaylistData] = useState(null);
  const [convertedLink, setConvertedLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState(null); // Google Access Token

  // Google 로그인
  const handleGoogleLogin = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube",
    redirect_uri: "http://localhost:3000/oauth2callback", // 리디렉션 URI 명시
    onSuccess: (tokenResponse) => {
      console.log("Google login successful:", tokenResponse);
      setGoogleAccessToken(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    },
  });

  // 플레이리스트 데이터 가져오기
  const handleFetchPlaylist = async () => {
    if (!sourcePlatform || !playlistLink) {
      alert("Please select a source platform and provide a playlist link.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchPlaylistData(sourcePlatform, playlistLink);
      if (data) setPlaylistData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Playlist 변환하기
  const handleConvertPlaylist = async () => {
    if (!sourcePlatform || !playlistData || !googleAccessToken) {
      alert("Please complete all steps before converting.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await convertPlaylist(
        sourcePlatform,
        destinationPlatform,
        playlistData,
        googleAccessToken
      );

      if (result?.playlistUrl) {
        setConvertedLink(result.playlistUrl);
      } else {
        alert("Failed to retrieve converted playlist.");
      }
    } catch (error) {
      console.error("Error during playlist conversion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="converter-container">
      <h1>Playlist Converter</h1>

      {/* Source Platform 선택 */}
      <div className="converter-step">
        <h2>1단계: Source Platform 선택</h2>
        <select
          value={sourcePlatform}
          onChange={(e) => setSourcePlatform(e.target.value)}
          className="converter-select"
        >
          <option value="">Select a source platform</option>
          <option value="spotify">Spotify</option>
          {/* 추후 다른 플랫폼 추가 가능 */}
        </select>
      </div>

      {/* Playlist Link 입력 */}
      {sourcePlatform && (
        <div className="converter-step">
          <h2>2단계: Playlist Link 입력</h2>
          <input
            type="text"
            value={playlistLink}
            onChange={(e) => setPlaylistLink(e.target.value)}
            placeholder="Enter your playlist link"
            className="converter-input"
          />
          <button
            onClick={handleFetchPlaylist}
            className="converter-button"
            disabled={!playlistLink || isLoading}
          >
            {isLoading ? "Fetching..." : "Fetch Playlist"}
          </button>
        </div>
      )}

      {/* Google 로그인 */}
      {playlistData && !googleAccessToken && (
        <div className="converter-step">
          <h2>3단계: Google 계정으로 로그인</h2>
          <button onClick={handleGoogleLogin} className="converter-button">
            Login with Google
          </button>
        </div>
      )}

      {/* 변환 버튼 */}
      {playlistData && googleAccessToken && (
        <div className="converter-step">
          <h2>4단계: YouTube로 변환</h2>
          <button
            onClick={handleConvertPlaylist}
            className="converter-button"
            disabled={isLoading}
          >
            {isLoading ? "Converting..." : "Convert Playlist"}
          </button>
        </div>
      )}

      {/* 변환된 링크 출력 */}
      {convertedLink && (
        <div className="converter-result">
          <h3>Converted Playlist:</h3>
          <a href={convertedLink} target="_blank" rel="noopener noreferrer">
            Open Playlist
          </a>
        </div>
      )}
    </div>
  );
}

export default Converter;
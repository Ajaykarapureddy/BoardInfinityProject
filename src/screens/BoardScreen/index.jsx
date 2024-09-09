import { useCallback, useState, useEffect } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLoader from "../../components/layout/AppLoader";
import useApp from "../../hooks/useApp";
import useStore from "../../store";
import BoardInterface from "./BoardInterface";
import BoardNotReady from "./BoardNotReady";
import BoardTopbar from "./BoardTopbar";
import { debounce } from "lodash";

const BoardScreen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false); // Flag to track if data is fetched
  const { boards, areBoardsFetched } = useStore();
  const { boardId } = useParams();
  const { fetchBoard, deleteBoard } = useApp();
  const board = useMemo(() => boards.find((b) => b.id === boardId), [boards, boardId]);

  const boardData = useMemo(() => data, [data]);

  const handleDeleteBoard = useCallback(async () => {
    if (!window.confirm("Do you want to delete this board?")) return;
    try {
      setLoading(true);
      await deleteBoard(boardId);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [boardId, deleteBoard]);

  const handleUpdateLastUpdated = useCallback(
    () => setLastUpdated(new Date().toLocaleString("en-US")),
    []
  );

  // Create the debounced function
  const debouncedFetchBoard = useCallback(
    debounce(async (boardId) => {
      try {
        const boardData = await fetchBoard(boardId);
        if (boardData) {
          const { lastUpdated, tabs } = boardData;
          setData(tabs);
          setLastUpdated(lastUpdated.toDate().toLocaleString("en-US"));
          setIsDataFetched(true); // Set flag to indicate data is fetched
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }, 300), // Adjust debounce delay if needed
    [fetchBoard]
  );

  useEffect(() => {
    if (!areBoardsFetched || !board) {
      navigate("/boards");
    } else if (!isDataFetched) {
      // Only call debouncedFetchBoard if data is not already fetched
      debouncedFetchBoard(boardId);

      // Clean up the debounce function on component unmount or when dependencies change
      return () => {
        debouncedFetchBoard.cancel();
      };
    }
  }, [areBoardsFetched, board, navigate, debouncedFetchBoard, boardId, isDataFetched]);

  if (!board) return null;
  if (loading) return <AppLoader />;
  if (!data) return <BoardNotReady />;

  return (
    <>
      <BoardTopbar
        name={board.name}
        color={board.color}
        lastUpdated={lastUpdated}
        deleteBoard={handleDeleteBoard}
      />
      <BoardInterface
        boardData={boardData}
        boardId={boardId}
        updateLastUpdated={handleUpdateLastUpdated}
      />
    </>
  );
};

export default BoardScreen;

import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import "./styles.css";

const colors = ["gray", "red", "green"];

const initialGrid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

const Item = styled.div`
  background: ${({ selectedIndex }) => colors[selectedIndex]};
  width: 1rem;
  height: 1rem;
  transition: opacity 100ms linear;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

const Row = styled.div`
  display: flex;
  column-gap: 0.2rem;
  margin-bottom: 0.2rem;
`;

const Grid = styled.div``;

const initialSelected = [...Array(9)].map(() => 0);

const humanPlayerIndex = 1;
const computerPlayerIndex = 2;

const hasComputerPlayer = true;
const firstPlayer = humanPlayerIndex;

const canWinInSet = (playerIndex, itemSet) => {
  const emptyItemIndex = itemSet.findIndex(({ value }) => {
    return !value;
  });
  const hasEmptyItem = emptyItemIndex > -1;
  const playerItemsInRow = itemSet.filter(({ value }) => value === playerIndex);

  const canPlayerWin = playerItemsInRow.length > 1;

  return [hasEmptyItem && canPlayerWin, itemSet[emptyItemIndex]];
};

export default function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [playerIndex, setPlayerIndex] = useState(firstPlayer);

  const unselectedIndexes = useMemo(() => {
    let unselected = [];

    grid.map((row, rowIndex) => {
      row.map((value, columnIndex) => {
        if (value) {
          return;
        }

        unselected.push({
          rowIndex,
          columnIndex
        });
      });
    });

    return unselected;
  }, [grid]);

  const setSelectedByIndex = (value, rowIndex, columnIndex) => {
    setGrid((prev) => {
      const next = [...prev];

      const nextRow = [...next[rowIndex]];
      nextRow[columnIndex] = value;

      next[rowIndex] = nextRow;

      return next;
    });
  };

  const togglePlayer = () => {
    setPlayerIndex((prev) => {
      return prev === humanPlayerIndex ? computerPlayerIndex : humanPlayerIndex;
    });
  };

  useEffect(() => {
    const noMovesLeft = !unselectedIndexes.length;

    if (noMovesLeft) {
      return;
    }

    const isComputerIndex = playerIndex === computerPlayerIndex;

    if (!hasComputerPlayer || !isComputerIndex) {
      return;
    }

    let nextItem;

    grid.map((row, rowIndex) => {
      if (nextItem) {
        return;
      }

      const [canWinRow, item] = canWinInSet(
        computerPlayerIndex,
        row.map((value, columnIndex) => {
          return { value, columnIndex, rowIndex };
        })
      );

      if (canWinRow) {
        nextItem = item;
      }
    });

    grid.map((row, rowIndex) => {
      if (nextItem) {
        return;
      }

      const [canWinRow, item] = canWinInSet(
        humanPlayerIndex,
        row.map((value, columnIndex) => {
          return { value, columnIndex, rowIndex };
        })
      );

      if (canWinRow) {
        nextItem = item;
      }
    });

    if (!nextItem) {
      nextItem = unselectedIndexes[0];
    }

    const { rowIndex, columnIndex } = nextItem;

    setSelectedByIndex(computerPlayerIndex, rowIndex, columnIndex);
    setPlayerIndex(humanPlayerIndex);
  }, [playerIndex]);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <Grid>
        {grid.map((rows, rowIndex) => {
          return (
            <Row key={rowIndex}>
              {rows.map((value, columnIndex) => {
                const onClick = () => {
                  const alreadySelected = value > 0;
                  if (alreadySelected) {
                    return;
                  }

                  setSelectedByIndex(playerIndex, rowIndex, columnIndex);
                  togglePlayer();
                };

                return (
                  <Item
                    key={columnIndex}
                    onClick={onClick}
                    selectedIndex={value}
                  />
                );
              })}
            </Row>
          );
        })}
      </Grid>
    </div>
  );
}

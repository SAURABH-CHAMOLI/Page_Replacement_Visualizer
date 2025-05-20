import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [referenceString, setReferenceString] = useState("");
  const [framesCount, setFramesCount] = useState(3);
  const [algorithm, setAlgorithm] = useState("fifo");
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const validateReferenceString = (refString) => /^[0-9,\s]+$/.test(refString);

  const parseReferenceString = (refString) => {
    return refString
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => parseInt(item, 10));
  };
  
  // FIFO Algorithm Implementation
  const fifoAlgorithm = (referenceArray, frameCount) => {
    const frames = Array(frameCount).fill(null);
    const steps = [];
    let pageFaults = 0;
    let pageHits = 0;
    let pointer = 0;

    for (let i = 0; i < referenceArray.length; i++) {
      const page = referenceArray[i];
      if (frames.includes(page)) {
        steps.push({
          page,
          frames: [...frames],
          pageFault: false,
          replaced: null,
          pointer,
        });
        pageHits++;
      } else {
        const replaced = frames[pointer];
        frames[pointer] = page;
        pointer = (pointer + 1) % frameCount;
        steps.push({
          page,
          frames: [...frames],
          pageFault: true,
          replaced,
          pointer,
        });
        pageFaults++;
      }
    }

    return {
      steps,
      pageFaults,
      pageHits,
      hitRatio: (pageHits / referenceArray.length).toFixed(2),
    };
  };
  
  // LRU Algorithm Implementation
  const lruAlgorithm = (referenceArray, frameCount) => {
    const frames = Array(frameCount).fill(null);
    const steps = [];
    let pageFaults = 0;
    let pageHits = 0;
    const usageTracker = [];

    for (let i = 0; i < referenceArray.length; i++) {
      const page = referenceArray[i];
      if (frames.includes(page)) {
        steps.push({
          page,
          frames: [...frames],
          pageFault: false,
          replaced: null,
        });
        pageHits++;
        const index = usageTracker.indexOf(page);
        if (index !== -1) {
          usageTracker.splice(index, 1);
        }
        usageTracker.push(page);
      } else {
        let replaced = null;
        if (!frames.includes(null)) {
          const lruPage = usageTracker.shift();
          const replaceIndex = frames.indexOf(lruPage);
          replaced = frames[replaceIndex];
          frames[replaceIndex] = page;
        } else {
          const emptyIndex = frames.indexOf(null);
          frames[emptyIndex] = page;
        }
        usageTracker.push(page);
        steps.push({
          page,
          frames: [...frames],
          pageFault: true,
          replaced,
        });
        pageFaults++;
      }
    }

    return {
      steps,
      pageFaults,
      pageHits,
      hitRatio: (pageHits / referenceArray.length).toFixed(2),
    };
  };
  
  // MRU Algorithm Implementation
const mruAlgorithm = (referenceArray, frameCount) => {
  const frames = Array(frameCount).fill(null);
  const steps = [];
  let pageFaults = 0;
  let pageHits = 0;
  const usageStack = [];

  for (let i = 0; i < referenceArray.length; i++) {
    const page = referenceArray[i];

    if (frames.includes(page)) {
      // Page hit
      pageHits++;
      steps.push({
        page,
        frames: [...frames],
        pageFault: false,
        replaced: null,
      });

      // Update usage stack
      const index = usageStack.indexOf(page);
      if (index !== -1) usageStack.splice(index, 1);
      usageStack.push(page);
    } else {
      // Page fault
      let replaced = null;

      if (!frames.includes(null)) {
        // Replace most recently used page
        const mruPage = usageStack.pop();
        const replaceIndex = frames.indexOf(mruPage);
        replaced = frames[replaceIndex];
        frames[replaceIndex] = page;
      } else {
        // Fill empty frame
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
      }

      usageStack.push(page);
      steps.push({
        page,
        frames: [...frames],
        pageFault: true,
        replaced,
      });
      pageFaults++;
    }
  }

  return {
    steps,
    pageFaults,
    pageHits,
    hitRatio: (pageHits / referenceArray.length).toFixed(2),
  };
};

  // Optimal Algorithm Implementation
  const optimalAlgorithm = (referenceArray, frameCount) => {
    const frames = Array(frameCount).fill(null);
    const steps = [];
    let pageFaults = 0;
    let pageHits = 0;

    for (let i = 0; i < referenceArray.length; i++) {
      const page = referenceArray[i];
      if (frames.includes(page)) {
        steps.push({
          page,
          frames: [...frames],
          pageFault: false,
          replaced: null,
        });
        pageHits++;
      } else {
        let replaced = null;
        if (!frames.includes(null)) {
          const futureUse = frames.map((frame) => {
            const nextUseIndex = referenceArray.indexOf(frame, i + 1);
            return nextUseIndex === -1 ? Infinity : nextUseIndex;
          });
          const maxIndex = futureUse.indexOf(Math.max(...futureUse));
          replaced = frames[maxIndex];
          frames[maxIndex] = page;
        } else {
          const emptyIndex = frames.indexOf(null);
          frames[emptyIndex] = page;
        }
        steps.push({
          page,
          frames: [...frames],
          pageFault: true,
          replaced,
        });
        pageFaults++;
      }
    }

    return {
      steps,
      pageFaults,
      pageHits,
      hitRatio: (pageHits / referenceArray.length).toFixed(2),
    };
  };

  const runSimulation = () => {
    if (!validateReferenceString(referenceString)) {
      alert("Please enter a valid reference string (comma-separated numbers)");
      return;
    }

    const refArray = parseReferenceString(referenceString);

    if (refArray.length === 0) {
      alert("Reference string cannot be empty");
      return;
    }

    let simulationResult;
    switch (algorithm) {
      case "fifo":
        simulationResult = fifoAlgorithm(refArray, framesCount);
        break;
      case "lru":
        simulationResult = lruAlgorithm(refArray, framesCount);
        break;
      case "opt":
        simulationResult = optimalAlgorithm(refArray, framesCount);
        break;
      case "mru":
        simulationResult = mruAlgorithm(refArray, framesCount);
        break;
      default:
        simulationResult = fifoAlgorithm(refArray, framesCount);
    }

    setResult(simulationResult);
    setShowDetails(false);
  };

  const animateSimulation = () => {
    if (!result) {
      runSimulation();
      return;
    }
    setIsAnimating(true);
    setShowDetails(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetSimulation = () => {
    setReferenceString("");
    setFramesCount(3);
    setAlgorithm("fifo");
    setResult(null);
    setIsAnimating(false);
    setShowDetails(false);
  };

  useEffect(() => {
    if (!isAnimating || !result) return;

    let step = 0;
    const timer = setInterval(() => {
      if (step >= result.steps.length) {
        setIsAnimating(false);
        clearInterval(timer);
        return;
      }
      step++;
      setShowDetails(step);
    }, 1000); // Fixed animation speed

    return () => clearInterval(timer);
  }, [isAnimating, result]);

  return (
    <div className="container">
      <header>
        <h1>Page Replacement Algorithms Simulator</h1>
      </header>

      <div className="input-container">
        <div className="input-group">
          <label htmlFor="reference-string">Reference String:</label>
          <input
            type="text"
            id="reference-string"
            placeholder="e.g., 1,2,3,4,1,2,5,1,2,3,4,5"
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="frames">Number of Frames:</label>
          <input
            type="number"
            id="frames"
            min="1"
            value={framesCount}
            onChange={(e) => setFramesCount(parseInt(e.target.value, 10))}
          />
        </div>

        <div className="input-group">
          <label htmlFor="algorithm">Algorithm:</label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="fifo">First-In-First-Out (FIFO)</option>
            <option value="lru">Least Recently Used (LRU)</option>
            <option value="opt">Optimal (OPT)</option>
            <option value="mru">Most Recently Used (MRU)</option>
          </select>
        </div>

        <div className="button-group">
          <button onClick={runSimulation} className="primary-btn">
            Run Simulation
          </button>
          <button
            onClick={isAnimating ? stopAnimation : animateSimulation}
            className="secondary-btn"
            disabled={!result}
          >
            {isAnimating ? "Stop Animation" : "Animate"}
          </button>
          <button onClick={resetSimulation} className="danger-btn">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="results-container">
          <div className="summary">
            <h2>Simulation Results</h2>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Page Faults:</span>
                <span className="stat-value">{result.pageFaults}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Page Hits:</span>
                <span className="stat-value">{result.pageHits}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Hit Ratio:</span>
                <span className="stat-value">{result.hitRatio}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total References:</span>
                <span className="stat-value">
                  {result.pageFaults + result.pageHits}
                </span>
              </div>
            </div>
          </div>

          {(showDetails || !isAnimating) && (
            <div className="visualization">
              <h3>Step-by-Step Visualization</h3>
              <div className="visualization-container">
                <table className="steps-table">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Page</th>
                      {Array.from({ length: framesCount }, (_, i) => (
                        <th key={i}>Frame {i + 1}</th>
                      ))}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps
                      .slice(
                        0,
                        typeof showDetails === "number"
                          ? showDetails
                          : result.steps.length
                      )
                      .map((step, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{step.page}</td>
                          {step.frames.map((frame, frameIdx) => (
                            <td
                              key={frameIdx}
                              className={
                                frame === step.page && step.pageFault
                                  ? "new-page"
                                  : frame === step.page
                                  ? "hit-page"
                                  : ""
                              }
                            >
                              {frame !== null ? frame : "-"}
                            </td>
                          ))}
                          <td className={step.pageFault ? "fault" : "hit"}>
                            {step.pageFault ? "Miss" : "Hit"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <footer>
        <p>&copy; 2025 Page Replacement Simulator - React Version</p>
      </footer>
    </div>
  );
}

export default App;

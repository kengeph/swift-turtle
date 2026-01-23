import { useState } from 'react'

const CHALLENGES = [
  {
    id: 1,
    title: "Perfect Cut",
    phase: "Phase 1: At Home",
    description: "Cut a piece of paper into what you think is a perfect 4-inch circle. Overlay them to see who is more accurate.",
  },
  {
    id: 2,
    title: "The Gram Master",
    phase: "Phase 1: At Home",
    description: "Target Weight: 42 grams. Find one item in the house that weighs as close to 42g as possible. (Use a kitchen scale to verify).",
  },
  {
    id: 3,
    title: "Minute Estimator",
    phase: "Phase 1: At Home",
    description: "Both start a stopwatch and put phones face down. Stop it when you think exactly 60 seconds have passed. Closest wins.",
  },
  {
    id: 4,
    title: "Water Pour",
    phase: "Phase 1: At Home",
    description: "Without using a scale first, fill a glass with what you think is exactly 200g of water. Closest wins.",
  },
  {
    id: 5,
    title: "The Obscure Hunt",
    phase: "Phase 1: At Home",
    description: "Each person has 60 seconds to find the most \"random\" or \"useless\" item in the house. Mutual agreement on the winner.",
  },
  {
    id: 6,
    title: "The $7.13 Challenge",
    phase: "Phase 2: At the Mall",
    description: "Find a single item with a price tag as close to $7.13 as possible. NOTE: Use the price BEFORE TAX as printed on the tag/sticker.",
  },
  {
    id: 7,
    title: "Q-Hunt",
    phase: "Phase 2: At the Mall",
    description: "First person to touch a physical item (not a sign) that starts with the letter \"Q\".",
  },
  {
    id: 8,
    title: "Wordle in the Wild",
    phase: "Phase 2: At the Mall",
    description: "Find 5 different signs that contain the letters in the word \"PLUMB\" (P, L, U, M, B).",
  },
  {
    id: 9,
    title: "The Name Tag",
    phase: "Phase 2: At the Mall",
    description: "Find your own first name (or just your first initial if it's a hard name) on a product or store sign.",
  },
  {
    id: 10,
    title: "Rainbow Sprint",
    phase: "Phase 2: At the Mall",
    description: "Find and touch an item for every color of the rainbow (Red, Orange, Yellow, Green, Blue, Indigo, Violet) in order.",
  },
]

function App() {
  const [currentGame, setCurrentGame] = useState(0)
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [winners, setWinners] = useState({})

  const handleWinner = (player) => {
    const newWinners = { ...winners, [currentGame + 1]: player }
    setWinners(newWinners)
    
    if (player === 'player1') {
      setScores(prev => ({ ...prev, player1: prev.player1 + 1 }))
    } else {
      setScores(prev => ({ ...prev, player2: prev.player2 + 1 }))
    }

    // Auto-advance to next game
    if (currentGame < CHALLENGES.length - 1) {
      setTimeout(() => {
        setCurrentGame(prev => prev + 1)
      }, 500)
    } else {
      // Last game completed, show results
      setTimeout(() => {
        setCurrentGame(CHALLENGES.length)
      }, 500)
    }
  }

  const resetGame = () => {
    setCurrentGame(0)
    setScores({ player1: 0, player2: 0 })
    setWinners({})
  }

  // Results screen
  if (currentGame === CHALLENGES.length) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">Final Results</h1>
          
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-semibold">Kenny</div>
            <div className="text-3xl font-bold text-blue-400">{scores.player1}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">Katie</div>
            <div className="text-3xl font-bold text-pink-400">{scores.player2}</div>
          </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Game Summary</h2>
            <div className="space-y-3">
              {CHALLENGES.map((challenge, index) => {
                const winner = winners[index + 1]
                return (
                  <div key={challenge.id} className="border-b border-slate-700 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-slate-400 mb-1">{challenge.phase}</div>
                        <div className="font-semibold">Game {challenge.id}: {challenge.title}</div>
                      </div>
                      <div className={`ml-4 px-3 py-1 rounded ${
                        winner === 'player1' 
                          ? 'bg-blue-500 text-white' 
                          : winner === 'player2'
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {winner === 'player1' ? 'Kenny' : winner === 'player2' ? 'Katie' : 'Not played'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  // Game screen
  const challenge = CHALLENGES[currentGame]
  const progress = ((currentGame + 1) / CHALLENGES.length) * 100

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Game {currentGame + 1} of {CHALLENGES.length}</span>
            <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex justify-between items-center mb-8 bg-slate-800 rounded-lg p-4">
          <div className="text-center flex-1">
            <div className="text-sm text-slate-400 mb-1">Kenny</div>
            <div className="text-3xl font-bold text-blue-400">{scores.player1}</div>
          </div>
          <div className="text-2xl font-bold mx-4">vs</div>
          <div className="text-center flex-1">
            <div className="text-sm text-slate-400 mb-1">Katie</div>
            <div className="text-3xl font-bold text-pink-400">{scores.player2}</div>
          </div>
        </div>

        {/* Challenge Card */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8">
          <div className="text-sm text-slate-400 mb-2">{challenge.phase}</div>
          <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">{challenge.description}</p>
        </div>

        {/* Winner Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleWinner('player1')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-xl"
          >
            Kenny Won
          </button>
          <button
            onClick={() => handleWinner('player2')}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-xl"
          >
            Katie Won
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

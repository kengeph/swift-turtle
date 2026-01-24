import { useState, useEffect } from 'react'

const CHALLENGES = [
  {
    id: 1,
    title: "Perfect Cut",
    phase: "1st Half",
    description: "Cut a piece of paper into what you think is a perfect 4-inch square. Overlay them to see who is more accurate.",
  },
  {
    id: 2,
    title: "The Gram Master",
    phase: "1st Half",
    description: "Target Weight: {targetWeight} grams. Find one item in the house that weighs as close to {targetWeight}g as possible. (Use a kitchen scale to verify). Best out of 3 rounds wins.",
    needsRandomWeight: true,
  },
  {
    id: 3,
    title: "Minute Estimator",
    phase: "1st Half",
    description: "Both start a stopwatch and put phones face down. Stop it when you think exactly 60 seconds have passed. Closest wins.",
  },
  {
    id: 4,
    title: "Water Pour",
    phase: "1st Half",
    description: "Without using a scale first, fill a glass with what you think is exactly 200g of water. Closest wins.",
  },
  {
    id: 5,
    title: "The Obscure Hunt",
    phase: "1st Half",
    description: "Each person has 60 seconds to find the most \"random\" or \"useless\" item in the house. Mutual agreement on the winner.",
  },
  {
    id: 6,
    title: "The $4.13 Challenge",
    phase: "2nd Half",
    description: "Find a single item with a price tag as close to $4.13 as possible. NOTE: Use the price BEFORE TAX as printed on the tag/sticker.",
  },
  {
    id: 7,
    title: "Q-Hunt",
    phase: "2nd Half",
    description: "First person to take a picture of a physical item (not a sign) that starts with the letter \"Q\".",
  },
  {
    id: 8,
    title: "Wordle in the Wild",
    phase: "2nd Half",
    description: "Open the Wordle archives link below and solve Wordles until you find a word you think you can find in the wild. Then go take a picture of it. First one back with a picture wins.",
    hasWordleLink: true,
  },
  {
    id: 9,
    title: "The Name Tag",
    phase: "2nd Half",
    description: "Find your own first name (or just your first initial if it's a hard name) on a product or store sign.",
  },
  {
    id: 10,
    title: "Rainbow Sprint",
    phase: "2nd Half",
    description: "Take pictures of items for every color of the rainbow (Red, Orange, Yellow, Green, Blue, Indigo, Violet) in order.",
  },
]

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentGame, setCurrentGame] = useState(0)
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [winners, setWinners] = useState({})
  const [gramMasterTarget, setGramMasterTarget] = useState(null)
  const [gramMasterRounds, setGramMasterRounds] = useState({ player1: [], player2: [] })

  // Generate random weight for Gram Master challenge
  useEffect(() => {
    if (currentGame === 1 && gramMasterTarget === null) {
      const randomWeight = Math.floor(Math.random() * (1000 - 50 + 1)) + 50
      setGramMasterTarget(randomWeight)
    }
  }, [currentGame, gramMasterTarget])

  const handleWinner = (player) => {
    const newWinners = { ...winners, [currentGame + 1]: player }
    setWinners(newWinners)
    
    // Handle Gram Master best of 3
    if (currentGame === 1) {
      const newRounds = { ...gramMasterRounds }
      if (player === 'player1') {
        newRounds.player1.push(1)
      } else {
        newRounds.player2.push(1)
      }
      setGramMasterRounds(newRounds)
      
      // Check if best of 3 is complete
      const totalRounds = newRounds.player1.length + newRounds.player2.length
      if (totalRounds < 3) {
        // Reset for next round
        const newWeight = Math.floor(Math.random() * (1000 - 50 + 1)) + 50
        setGramMasterTarget(newWeight)
        return // Don't advance yet
      } else {
        // Determine overall winner
        const player1Wins = newRounds.player1.length
        const player2Wins = newRounds.player2.length
        const overallWinner = player1Wins > player2Wins ? 'player1' : 'player2'
        
        if (overallWinner === 'player1') {
          setScores(prev => ({ ...prev, player1: prev.player1 + 1 }))
        } else {
          setScores(prev => ({ ...prev, player2: prev.player2 + 1 }))
        }
      }
    } else {
      // Normal scoring
      if (player === 'player1') {
        setScores(prev => ({ ...prev, player1: prev.player1 + 1 }))
      } else {
        setScores(prev => ({ ...prev, player2: prev.player2 + 1 }))
      }
    }

    // Auto-advance to next game (unless Gram Master needs more rounds)
    if (currentGame === 1 && gramMasterRounds.player1.length + gramMasterRounds.player2.length < 3) {
      return // Stay on this game for next round
    }

    // Check if we just finished the 5th game (1st half) - go to transition page
    if (currentGame === 4) {
      setTimeout(() => {
        setCurrentGame(-1) // Transition page
      }, 500)
      return
    }

    if (currentGame < CHALLENGES.length - 1) {
      setTimeout(() => {
        setCurrentGame(prev => prev + 1)
        // Reset Gram Master for next game if needed
        if (currentGame + 1 !== 1) {
          setGramMasterTarget(null)
          setGramMasterRounds({ player1: [], player2: [] })
        }
      }, 500)
    } else {
      // Last game completed, show results
      setTimeout(() => {
        setCurrentGame(CHALLENGES.length)
      }, 500)
    }
  }

  const goBack = () => {
    if (currentGame === -1) {
      // From transition page, go back to game 5
      setCurrentGame(4)
    } else if (currentGame === CHALLENGES.length) {
      // From results, go back to last game
      setCurrentGame(CHALLENGES.length - 1)
    } else if (currentGame > 0) {
      // From a game, go back one
      setCurrentGame(prev => prev - 1)
      // Remove the winner for the game we're going back to
      const newWinners = { ...winners }
      delete newWinners[currentGame]
      setWinners(newWinners)
      // Adjust scores if needed
      const removedWinner = winners[currentGame]
      if (removedWinner === 'player1') {
        setScores(prev => ({ ...prev, player1: Math.max(0, prev.player1 - 1) }))
      } else if (removedWinner === 'player2') {
        setScores(prev => ({ ...prev, player2: Math.max(0, prev.player2 - 1) }))
      }
    }
  }

  const continueToSecondHalf = () => {
    setCurrentGame(5) // Start 2nd half (game 6, index 5)
  }

  const resetGame = () => {
    setGameStarted(false)
    setCurrentGame(0)
    setScores({ player1: 0, player2: 0 })
    setWinners({})
    setGramMasterTarget(null)
    setGramMasterRounds({ player1: [], player2: [] })
  }

  const startGame = () => {
    setGameStarted(true)
    setCurrentGame(0)
  }

  // Intro screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold mb-6">Couple's Challenge</h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Welcome to your competitive challenge series! You'll face 10 fun challenges designed to test your skills, creativity, and teamwork.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">1st Half: At Home (5 Challenges)</h3>
                <p className="text-slate-300">Start with challenges you can do right at home - testing precision, estimation, and creativity.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-400 mb-2">2nd Half: Out on the Town (5 Challenges)</h3>
                <p className="text-slate-300">Then head out for challenges that will take you around town - hunting, searching, and exploring together.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-3">Pick a Prize!</h2>
            <p className="text-slate-300 mb-4">
              Before you start, decide on a prize for the winner! Maybe the winner picks where to eat lunch, gets to choose the next movie, or gets a special treat. Make it fun!
            </p>
            <p className="text-slate-400 italic">
              (Take a moment to discuss and agree on your prize now)
            </p>
          </div>

          <button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            LET THE GAMES BEGIN!
          </button>
        </div>
      </div>
    )
  }

  // Transition page between halves
  if (currentGame === -1) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-6">1st Half Complete! 🎉</h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Great job completing the first half! Now it's time to head over near the mall for the next challenges.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <p className="text-lg text-slate-300">
              Make sure you're ready to go out and explore! The 2nd half challenges will have you hunting, searching, and taking pictures around the mall area.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={goBack}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={continueToSecondHalf}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Continue to 2nd Half →
            </button>
          </div>
        </div>
      </div>
    )
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

          <div className="flex gap-4 mt-6">
            <button
              onClick={goBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={resetGame}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Game screen
  const challenge = CHALLENGES[currentGame]
  const completedGames = Object.keys(winners).length
  const progress = (completedGames / CHALLENGES.length) * 100
  const gramMasterRound = gramMasterRounds.player1.length + gramMasterRounds.player2.length + 1

  // Get description with dynamic content
  let description = challenge.description
  if (challenge.needsRandomWeight && gramMasterTarget) {
    description = description.replace('{targetWeight}', gramMasterTarget)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        {currentGame > 0 && (
          <button
            onClick={goBack}
            className="mb-4 text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Game {currentGame + 1} of {CHALLENGES.length}</span>
            <span className="text-sm text-slate-400">{completedGames} completed</span>
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
          <h1 className="text-3xl font-bold mb-4">
            {challenge.title}
            {currentGame === 1 && gramMasterRounds.player1.length + gramMasterRounds.player2.length < 3 && (
              <span className="ml-3 text-lg font-normal text-slate-400">
                (Round {gramMasterRound} of 3)
              </span>
            )}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">{description}</p>
          
          {challenge.hasWordleLink && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <a
                href="https://www.nytimes.com/crosswords/game/wordle-archive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                📚 Open Wordle Archives (New Tab)
              </a>
            </div>
          )}
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

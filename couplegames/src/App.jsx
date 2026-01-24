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
    description: "This challenge has 3 rounds. Each round, a random target weight will be shown. Find one item in the house that weighs as close to that target as possible. (Use a kitchen scale to verify). The person who wins the most rounds out of 3 wins the challenge.",
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
    description: "Find your own first name on a product or store sign.",
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
    // Handle Gram Master best of 3 - don't add to winners until all rounds are done
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
        // Reset for next round - don't add to winners yet
        const newWeight = Math.floor(Math.random() * (1000 - 50 + 1)) + 50
        setGramMasterTarget(newWeight)
        return // Don't advance yet
      } else {
        // All 3 rounds complete - now add to winners and score
        const player1Wins = newRounds.player1.length
        const player2Wins = newRounds.player2.length
        const overallWinner = player1Wins > player2Wins ? 'player1' : 'player2'
        
        // Add to winners object
        const newWinners = { ...winners, [currentGame + 1]: overallWinner }
        setWinners(newWinners)
        
        // Update scores
        if (overallWinner === 'player1') {
          setScores(prev => ({ ...prev, player1: prev.player1 + 1 }))
        } else {
          setScores(prev => ({ ...prev, player2: prev.player2 + 1 }))
        }
      }
    } else {
      // Normal game - add to winners and score immediately
      const newWinners = { ...winners, [currentGame + 1]: player }
      setWinners(newWinners)
      
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

  // Helper function to recalculate scores from winners object
  const recalculateScores = (winnersObj) => {
    let newScores = { player1: 0, player2: 0 }
    for (let i = 1; i <= CHALLENGES.length; i++) {
      if (winnersObj[i] === 'player1') {
        newScores.player1++
      } else if (winnersObj[i] === 'player2') {
        newScores.player2++
      }
    }
    return newScores
  }

  const goBack = () => {
    if (currentGame === -1) {
      // From transition page, go back to game 5
      const newWinners = { ...winners }
      const gameId = 5 // Game 5 is index 4, but stored as ID 5
      if (newWinners[gameId]) {
        delete newWinners[gameId]
        setWinners(newWinners)
        // Recalculate all scores from scratch
        setScores(recalculateScores(newWinners))
      }
      setCurrentGame(4)
    } else if (currentGame === CHALLENGES.length) {
      // From results, go back to last game
      const newWinners = { ...winners }
      const gameId = CHALLENGES.length
      if (newWinners[gameId]) {
        delete newWinners[gameId]
        setWinners(newWinners)
        // Recalculate all scores from scratch
        setScores(recalculateScores(newWinners))
      }
      setCurrentGame(CHALLENGES.length - 1)
    } else if (currentGame > 0) {
      // From a game, go back one
      const newWinners = { ...winners }
      const targetGameId = currentGame + 1 // Current game ID
      
      // Handle Gram Master special case
      if (currentGame === 1) {
        // Going back from Gram Master - need to handle rounds
        const totalRounds = gramMasterRounds.player1.length + gramMasterRounds.player2.length
        if (totalRounds > 0) {
          const newRounds = { ...gramMasterRounds }
          
          // If all 3 rounds are complete, remove the overall winner entry
          if (totalRounds === 3 && newWinners[targetGameId]) {
            delete newWinners[targetGameId]
          }
          
          // Remove the last round - heuristic: remove from the array with more entries
          // If equal, we can't know for sure, but we'll remove from player1 as default
          // This is a limitation, but works for most cases
          if (newRounds.player1.length > newRounds.player2.length) {
            newRounds.player1.pop()
          } else if (newRounds.player2.length > newRounds.player1.length) {
            newRounds.player2.pop()
          } else if (newRounds.player1.length > 0) {
            // Equal, remove from player1 (arbitrary but consistent)
            newRounds.player1.pop()
          }
          setGramMasterRounds(newRounds)
          
          // Generate new weight for the round we're going back to
          const remainingRounds = newRounds.player1.length + newRounds.player2.length
          if (remainingRounds > 0) {
            const newWeight = Math.floor(Math.random() * (1000 - 50 + 1)) + 50
            setGramMasterTarget(newWeight)
          } else {
            // Going back to first round, reset weight
            setGramMasterTarget(null)
          }
          
          // Recalculate all scores from scratch
          setWinners(newWinners)
          setScores(recalculateScores(newWinners))
        }
      } else {
        // Normal game - remove winner for current game and all subsequent games
        // Remove all winners from current game onwards
        for (let i = targetGameId; i <= CHALLENGES.length; i++) {
          if (newWinners[i]) {
            delete newWinners[i]
          }
        }
        setWinners(newWinners)
        
        // Recalculate all scores from scratch
        setScores(recalculateScores(newWinners))
      }
      
      const newCurrentGame = currentGame - 1
      
      // If going back to game 1 (index 0), clear all winners and reset scores
      if (newCurrentGame === 0) {
        setWinners({})
        setScores({ player1: 0, player2: 0 })
        // Also reset Gram Master state
        setGramMasterTarget(null)
        setGramMasterRounds({ player1: [], player2: [] })
      } else {
        // Otherwise, just update winners and recalculate scores
        setWinners(newWinners)
        setScores(recalculateScores(newWinners))
      }
      
      setCurrentGame(newCurrentGame)
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
          {/* Back button - hidden on intro since there's nowhere to go back to */}
          <h1 className="text-5xl font-bold mb-6">Couple's Challenge</h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Welcome to your competitive challenge series! You'll face 10 fun challenges designed to test your skills and creativity.
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
                <p className="text-slate-300">Then head out for challenges that will take you around town - hunting, searching, and exploring.</p>
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
          
          {/* Score Display */}
          <div className="flex justify-between items-center mb-8 bg-slate-800 rounded-lg p-4 max-w-md mx-auto">
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
  // Calculate completed games - count games that have a winner entry
  // Since we only add Gram Master to winners when all 3 rounds are done,
  // we can simply count all entries in winners
  const completedGames = Object.keys(winners).length
  const progress = (completedGames / CHALLENGES.length) * 100
  const gramMasterRound = gramMasterRounds.player1.length + gramMasterRounds.player2.length + 1

  // Get description with dynamic content
  let description = challenge.description
  if (challenge.needsRandomWeight && gramMasterTarget) {
    // For Gram Master, show the current round's target weight
    const roundNum = gramMasterRounds.player1.length + gramMasterRounds.player2.length + 1
    description = `Round ${roundNum} of 3: Find an item that weighs as close to ${gramMasterTarget} grams as possible. (Use a kitchen scale to verify). The person who wins the most rounds out of 3 wins the challenge.`
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
        <div className="mb-8 bg-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
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
          {/* Manual Score Adjustment */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-500 mb-2 text-center">Score not right? Adjust manually:</div>
            <div className="flex gap-4 justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScores(prev => ({ ...prev, player1: Math.max(0, prev.player1 - 1) }))}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded text-sm"
                  title="Decrease Kenny's score"
                >
                  −
                </button>
                <span className="text-sm text-slate-400">Kenny</span>
                <button
                  onClick={() => setScores(prev => ({ ...prev, player1: prev.player1 + 1 }))}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded text-sm"
                  title="Increase Kenny's score"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScores(prev => ({ ...prev, player2: Math.max(0, prev.player2 - 1) }))}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded text-sm"
                  title="Decrease Katie's score"
                >
                  −
                </button>
                <span className="text-sm text-slate-400">Katie</span>
                <button
                  onClick={() => setScores(prev => ({ ...prev, player2: prev.player2 + 1 }))}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded text-sm"
                  title="Increase Katie's score"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Card */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8">
          <div className="text-sm text-slate-400 mb-2">{challenge.phase}</div>
          <h1 className="text-3xl font-bold mb-4">
            {challenge.title}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">{description}</p>
          
          {/* Gram Master Round Scoreboard */}
          {currentGame === 1 && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-3">Round Scoreboard (Best of 3)</div>
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-blue-400">Kenny</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {gramMasterRounds.player1.length} {gramMasterRounds.player1.length === 1 ? 'round' : 'rounds'}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-pink-400">Katie</div>
                  <div className="text-2xl font-bold text-pink-400">
                    {gramMasterRounds.player2.length} {gramMasterRounds.player2.length === 1 ? 'round' : 'rounds'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                Round {gramMasterRounds.player1.length + gramMasterRounds.player2.length + 1} of 3
              </div>
            </div>
          )}
          
          {challenge.hasWordleLink && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <a
                href="https://garlicbread.vercel.app/"
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
        {currentGame === 1 ? (
          // Gram Master: Round winner buttons
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleWinner('player1')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              Kenny Won This Round
            </button>
            <button
              onClick={() => handleWinner('player2')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              Katie Won This Round
            </button>
          </div>
        ) : (
          // Normal challenge: Overall winner buttons
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
        )}
      </div>
    </div>
  )
}

export default App

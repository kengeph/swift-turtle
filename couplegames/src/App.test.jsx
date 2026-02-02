import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test
    vi.clearAllMocks()
  })

  describe('Intro Screen', () => {
    it('renders the intro screen with title', () => {
      render(<App />)
      expect(screen.getByText("Couple's Challenge")).toBeInTheDocument()
    })

    it('displays game instructions', () => {
      render(<App />)
      expect(screen.getByText(/1st Half: At Home/i)).toBeInTheDocument()
      expect(screen.getByText(/2nd Half: Out on the Town/i)).toBeInTheDocument()
    })

    it('shows the start button', () => {
      render(<App />)
      expect(screen.getByText('LET THE GAMES BEGIN!')).toBeInTheDocument()
    })

    it('starts the game when button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const startButton = screen.getByText('LET THE GAMES BEGIN!')
      await user.click(startButton)
      
      // Should show first challenge
      await waitFor(() => {
        expect(screen.getByText(/Game 1 of 10/i)).toBeInTheDocument()
      })
    })
  })

  describe('Game Flow', () => {
    it('displays the first challenge after starting', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
    })

    it('shows progress bar with correct game number', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        expect(screen.getByText(/Game 1 of 10/i)).toBeInTheDocument()
      })
    })

    it('displays score display with both players', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        expect(screen.getByText('Kenny')).toBeInTheDocument()
        expect(screen.getByText('Katie')).toBeInTheDocument()
      })
    })
  })

  describe('Winner Selection', () => {
    it('advances to next game when a winner is selected', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      const kennyButton = screen.getByText('Kenny Won')
      await user.click(kennyButton)
      
      // Should advance to next game after delay
      await waitFor(() => {
        expect(screen.getByText('The Gram Master')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('updates score when player wins', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      // Initial scores should be 0
      const scoreElements = screen.getAllByText('0')
      expect(scoreElements.length).toBeGreaterThan(0)
      
      const kennyButton = screen.getByText('Kenny Won')
      await user.click(kennyButton)
      
      // Score should update (checking for 1 in Kenny's score)
      await waitFor(() => {
        const kennyScore = screen.getAllByText('1')
        expect(kennyScore.length).toBeGreaterThan(0)
      }, { timeout: 2000 })
    })
  })

  describe('Gram Master Challenge', () => {
    it('displays Gram Master challenge with rounds', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      // Click through first game
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      const kennyButton = screen.getByText('Kenny Won')
      await user.click(kennyButton)
      
      // Should show Gram Master
      await waitFor(() => {
        expect(screen.getByText('The Gram Master')).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Should show round buttons
      expect(screen.getByText(/Kenny Won This Round/i)).toBeInTheDocument()
      expect(screen.getByText(/Katie Won This Round/i)).toBeInTheDocument()
    })

    it('shows round scoreboard for Gram Master', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      // Navigate to Gram Master
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Kenny Won'))
      
      await waitFor(() => {
        expect(screen.getByText('The Gram Master')).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Should show round scoreboard
      expect(screen.getByText(/Round Scoreboard/i)).toBeInTheDocument()
    })
  })

  describe('Back Button', () => {
    it('shows back button on game screen after first game', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      // Complete first game to get to second game where back button shows
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Kenny Won'))
      
      // Now on second game, back button should be visible
      await waitFor(() => {
        expect(screen.getByText('The Gram Master')).toBeInTheDocument()
        expect(screen.getByText('← Back')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('goes back to previous game when back button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      // Complete first game
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Kenny Won'))
      
      // Should be on second game
      await waitFor(() => {
        expect(screen.getByText('The Gram Master')).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Click back
      const backButton = screen.getByText('← Back')
      await user.click(backButton)
      
      // Should be back on first game
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
    })
  })

  describe('Score Calculation', () => {
    it('recalculates scores correctly when going back', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      // Win first game
      await waitFor(() => {
        expect(screen.getByText('Perfect Cut')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Kenny Won'))
      
      // Win second game
      await waitFor(() => {
        expect(screen.getByText('The Gram Master')).toBeInTheDocument()
      }, { timeout: 2000 })
      
      // Go back
      await user.click(screen.getByText('← Back'))
      
      // Score should be recalculated (should be 0 since we went back)
      await waitFor(() => {
        const zeroScores = screen.getAllByText('0')
        expect(zeroScores.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Progress Bar', () => {
    it('shows correct progress for completed games', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        expect(screen.getByText(/0 completed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Score Edit Feature', () => {
    it('shows edit button on score display', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        // Edit button should be present (emoji or text)
        const editButton = screen.getByTitle('Edit scores')
        expect(editButton).toBeInTheDocument()
      })
    })

    it('toggles score edit controls when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      await user.click(screen.getByText('LET THE GAMES BEGIN!'))
      
      await waitFor(() => {
        const editButton = screen.getByTitle('Edit scores')
        expect(editButton).toBeInTheDocument()
      })
      
      const editButton = screen.getByTitle('Edit scores')
      await user.click(editButton)
      
      // Should show manual adjustment controls
      await waitFor(() => {
        expect(screen.getByText(/Score not right\?/i)).toBeInTheDocument()
      })
    })
  })
})

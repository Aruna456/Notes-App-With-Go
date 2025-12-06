package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Note struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

// In-Memory DB
type Store struct {
	notes  []Note
	nextID int
}

func NewStore() *Store {
	return &Store{
		notes:  []Note{},
		nextID: 1,
	}
}

func (s *Store) GetAll() []Note {
	return s.notes
}

func (s *Store) GetById(ID int) (Note, bool) {
	for _, n := range s.notes {

		if n.ID == ID {
			return n, true
		}
	}
	return Note{}, false
}

func (s *Store) Add(title string, content string) Note {
	newnote := Note{
		ID:      s.nextID,
		Title:   title,
		Content: content,
	}
	s.notes = append(s.notes, newnote)
	s.nextID++

	return newnote
}

func (s *Store) DeleteById(ID int) bool {
	for i, n := range s.notes {
		if n.ID == ID {
			s.notes = append(s.notes[:i], s.notes[i+1:]...)
			return true
		}
	}
	return false
}

func main() {

	r := gin.Default()

	// Initialize store
	store := NewStore()

	// GET Notes
	r.GET("/notes", func(ctx *gin.Context) {
		notes := store.GetAll()
		ctx.JSON(http.StatusOK, notes)
	})

	// POST Notes
	r.POST("/notes", func(ctx *gin.Context) {
		var input struct {
			Title   string `json:"title"`
			Content string `json:"content"`
		}

		if err := ctx.BindJSON(&input); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error()})
			return
		}

		notes := store.Add(input.Title, input.Content)
		ctx.JSON(http.StatusCreated, notes)
	})

	// Delete note
	r.DELETE("/notes/:id", func(ctx *gin.Context) {
		idStr := ctx.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		notes := store.DeleteById(id)
		ctx.JSON(http.StatusOK, notes)
	})

	r.Run() //listens to 8080 by default

}

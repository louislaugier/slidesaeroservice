package slides

import (
	"time"

	"github.com/google/uuid"
)

type comment struct {
	ID          uuid.UUID `json:"id"`
	Author      string    `json:"author"`
	SlideID     uuid.UUID `json:"slide_id"`
	Rating      float64   `json:"rating"`
	PublishDate time.Time `json:"publish_date"`
	Content     string    `json:"content"`
}

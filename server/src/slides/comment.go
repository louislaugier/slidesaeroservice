package slides

import (
	"time"

	"github.com/google/uuid"
)

type comment struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	SlideID     uuid.UUID `json:"slide_id"`
	Rating      float64   `json:"rating"`
	PublishDate time.Time `json:"publish_date"`
	Content     string    `json:"content"`
}

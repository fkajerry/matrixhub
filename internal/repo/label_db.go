// Copyright The MatrixHub Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package repo

import (
	"context"

	"gorm.io/gorm"

	"github.com/matrixhub-ai/matrixhub/internal/domain/model"
)

type labelDB struct {
	db *gorm.DB
}

// NewLabelDB creates a new LabelRepo instance
func NewLabelDB(db *gorm.DB) model.ILabelRepo {
	return &labelDB{db: db}
}

// ListByCategoryAndScope retrieves labels by category and scope
func (l *labelDB) ListByCategoryAndScope(ctx context.Context, category, scope string) ([]*model.Label, error) {
	var labels []*model.Label
	err := l.db.WithContext(ctx).
		Where("category = ? AND scope = ?", category, scope).
		Find(&labels).Error
	return labels, err
}

// GetByModelID retrieves labels for a specific model
func (l *labelDB) GetByModelID(ctx context.Context, modelID int64) ([]*model.Label, error) {
	var labels []*model.Label
	err := l.db.WithContext(ctx).
		Table("labels l").
		Joins("INNER JOIN models_labels ml ON l.id = ml.label_id").
		Where("ml.model_id = ?", modelID).
		Find(&labels).Error
	return labels, err
}

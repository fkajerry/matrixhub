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

package handler

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	datasetv1alpha1 "github.com/matrixhub-ai/matrixhub/api/go/v1alpha1"
	"github.com/matrixhub-ai/matrixhub/internal/infra/log"
)

type DatasetHandler struct{}

func NewDatasetHandler() IHandler {
	handler := &DatasetHandler{}
	return handler
}

func (h *DatasetHandler) RegisterToServer(options *ServerOptions) {
	datasetv1alpha1.RegisterDatasetsServer(options.GRPCServer, h)
	if err := datasetv1alpha1.RegisterDatasetsHandlerServer(context.Background(), options.GatewayMux, h); err != nil {
		log.Errorf("dataset handler error: %s", err.Error())
	}
}

func (h *DatasetHandler) ListDatasetTaskLabels(ctx context.Context, request *datasetv1alpha1.ListDatasetTaskLabelsRequest) (*datasetv1alpha1.ListDatasetTaskLabelsResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) ListDatasets(ctx context.Context, request *datasetv1alpha1.ListDatasetsRequest) (*datasetv1alpha1.ListDatasetsResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) GetDataset(ctx context.Context, request *datasetv1alpha1.GetDatasetRequest) (*datasetv1alpha1.Dataset, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) CreateDataset(ctx context.Context, request *datasetv1alpha1.CreateDatasetRequest) (*datasetv1alpha1.CreateDatasetResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) DeleteDataset(ctx context.Context, request *datasetv1alpha1.DeleteDatasetRequest) (*datasetv1alpha1.DeleteDatasetResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) ListDatasetRevisions(ctx context.Context, request *datasetv1alpha1.ListDatasetRevisionsRequest) (*datasetv1alpha1.ListDatasetRevisionsResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) ListDatasetCommits(ctx context.Context, request *datasetv1alpha1.ListDatasetCommitsRequest) (*datasetv1alpha1.ListDatasetCommitsResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) GetDatasetCommit(ctx context.Context, request *datasetv1alpha1.GetDatasetCommitRequest) (*datasetv1alpha1.Commit, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) GetDatasetTree(ctx context.Context, request *datasetv1alpha1.GetDatasetTreeRequest) (*datasetv1alpha1.GetDatasetTreeResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

func (h *DatasetHandler) GetDatasetBlob(ctx context.Context, request *datasetv1alpha1.GetDatasetBlobRequest) (*datasetv1alpha1.GetDatasetBlobResponse, error) {
	return nil, status.Error(codes.Unimplemented, "Not implemented")
}

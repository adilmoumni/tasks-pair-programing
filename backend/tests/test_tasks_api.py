from fastapi.testclient import TestClient


def test_list_tasks_starts_empty(client: TestClient) -> None:
    response = client.get("/tasks")

    assert response.status_code == 200
    assert response.json() == []


def test_create_and_list_task(client: TestClient) -> None:
    create_response = client.post(
        "/tasks",
        json={
            "prefix": "DEV",
            "name": "Create API tests",
            "description": "Cover the task endpoints",
        },
    )

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["id"] == 1
    assert created["prefix"] == "DEV"
    assert created["name"] == "Create API tests"
    assert created["description"] == "Cover the task endpoints"
    assert created["status"] == "todo"
    assert created["created_at"] is not None
    assert created["updated_at"] is not None

    list_response = client.get("/tasks")

    assert list_response.status_code == 200
    assert list_response.json() == [created]


def test_update_task_partially(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={"prefix": "DEV", "name": "Original task"},
    ).json()

    response = client.patch(
        f"/tasks/{created['id']}",
        json={"prefix": "OPS", "status": "in_progress"},
    )

    assert response.status_code == 200
    updated = response.json()
    assert updated["prefix"] == "OPS"
    assert updated["status"] == "in_progress"
    assert updated["name"] == "Original task"


def test_delete_task(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={"prefix": "DEV", "name": "Task to delete"},
    ).json()

    delete_response = client.delete(f"/tasks/{created['id']}")

    assert delete_response.status_code == 204
    assert delete_response.content == b""
    assert client.get("/tasks").json() == []


def test_update_missing_task_returns_404(client: TestClient) -> None:
    response = client.patch("/tasks/999", json={"status": "done"})

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}


def test_delete_missing_task_returns_404(client: TestClient) -> None:
    response = client.delete("/tasks/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}


def test_create_task_validates_required_fields(client: TestClient) -> None:
    response = client.post("/tasks", json={"name": "Missing prefix"})

    assert response.status_code == 422


def test_create_task_rejects_unknown_status(client: TestClient) -> None:
    response = client.post(
        "/tasks",
        json={"prefix": "DEV", "name": "Invalid", "status": "blocked"},
    )

    assert response.status_code == 422


def test_patch_rejects_null_required_field(client: TestClient) -> None:
    created = client.post(
        "/tasks",
        json={"prefix": "DEV", "name": "Valid task"},
    ).json()

    response = client.patch(f"/tasks/{created['id']}", json={"prefix": None})

    assert response.status_code == 422

import docker

def execute_in_container(code, language="python"):
    client = docker.from_env()
    result = client.containers.run(
        image="python:3.8",
        command=f"python -c '{code}'",
        remove=True,
        detach=False
    )
    return result.decode("utf-8")

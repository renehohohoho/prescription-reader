from types import SimpleNamespace

import pytest

import processor


class FakeClient:
    def __init__(self, content):
        self.content = content
        self.kwargs = None
        self.chat = SimpleNamespace(completions=SimpleNamespace(create=self._create))

    def _create(self, **kwargs):
        self.kwargs = kwargs
        message = SimpleNamespace(content=self.content)
        return SimpleNamespace(choices=[SimpleNamespace(message=message)])


def use_client(monkeypatch, content):
    client = FakeClient(content)
    monkeypatch.setattr(processor, "_get_client", lambda: client)
    return client


def test_extract_fields_parses_json(monkeypatch):
    client = use_client(monkeypatch, '{"patient_name": "王小明", "medications": []}')

    fields = processor.extract_fields("OCR 文字")

    assert fields == {"patient_name": "王小明", "medications": []}
    assert client.kwargs["response_format"] == {"type": "json_object"}
    assert client.kwargs["messages"][1] == {"role": "user", "content": "OCR 文字"}


@pytest.mark.parametrize("content", [None, "", "   ", "抱歉，我無法辨識", "[1, 2]"])
def test_extract_fields_rejects_bad_output(monkeypatch, content):
    use_client(monkeypatch, content)
    with pytest.raises(ValueError):
        processor.extract_fields("OCR 文字")


def test_process_adds_source_and_raw_text(monkeypatch):
    use_client(monkeypatch, '{"hospital": "範例醫院"}')
    monkeypatch.setattr(processor, "ocr_image", lambda path: "辨識出的文字")

    result = processor.process("data/samples/rx001.png")

    assert result == {
        "hospital": "範例醫院",
        "source_file": "rx001.png",
        "ocr_raw": "辨識出的文字",
    }

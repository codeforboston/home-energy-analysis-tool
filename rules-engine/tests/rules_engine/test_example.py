from rules_engine import example

def test_add_two_numbers():
    result = example.add_two_numbers(1, 2)
    assert result == 3
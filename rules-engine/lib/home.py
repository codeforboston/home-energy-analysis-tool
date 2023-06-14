import pandas as pd

class ADDRESS:
    def __init__(self, address, zip, city, state):
        self.address = address
        self.zip = zip
        self.city = city
        self.state = state
    def __str__(self):
        return f"{self.address}, {self.city} {self.state}, {self.zip}"

# The purpose of this class is to consolidate the information
# into a singular logical space without needing all the data
# in the same dataframe, if this ends up being a wase of space
# it will be dealt with accordingly

class HOME:
    # This is gonna be filled with stubs since I need to go through the rules engine a bit deeper
    def __init__():
        return True

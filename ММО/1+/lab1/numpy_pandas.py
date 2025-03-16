import numpy as np
import pandas as pd

def part_numpy():
    print("1) numpy:\n")
    # Двумерный массив из 20 целых случайных чисел
    arr = np.random.randint(0, 100, 20).reshape(4, 5)
    print(f"Исходный массив:\n{arr}\n")
    # Разделение на 2 массива
    arr1, arr2 = np.split(arr, 2)
    print(f"Первый массив:\n{arr1}\n")
    print(f"Второй массив:\n{arr2}\n")
    # Поиск всех заданных значений в первом массиве
    values = arr1[arr1 == 6]
    print(f"Значения, равные 6, в первом массиве: {values}")
    # Количество найденных элементов
    count = len(values)
    print(f"Количество найденных элементов: {count}")
    print("\n----------------------------------------------\n")

def part_pandas():
    print("2) pandas:\n")
    # Объект Series из массива NumPy
    s = pd.Series(np.random.randint(0, 100, 10))
    print(f"Объект Series:\n{s}\n")
    # Математические операции с объектом Series
    print(f"Сумма элементов: {s.sum()}")
    print(f"Среднее значение: {s.mean()}\n")
    # Объект Dataframe из массива numpy + строка заголовков в созданном Dataframe
    df = pd.DataFrame(np.random.randint(0, 100, 20).reshape(4, 5), list('ABCD'), list('ABCDE'))
    print(f"Объект Dataframe:\n{df}\n")
    # Удаление любой строки
    df = df.drop('A')
    print(f"Dataframe после удаления строки:\n{df}\n")
    # Удаление любого столбца
    df = df.drop('A', axis = 1)
    print(f"Dataframe после удаления столбца:\n{df}\n")
    # Размер получившегося Dataframe
    print(f"Размер Dataframe: {df.shape}\n")
    # Поиск всех элементов, равных какому-либо числу
    num = 50
    elements = df[df == num].dropna(how = 'all').dropna(axis = 1, how = 'all')
    print(f"Элементы, равные {num}:\n{elements}")

if __name__ == '__main__':
    part_numpy()
    part_pandas()
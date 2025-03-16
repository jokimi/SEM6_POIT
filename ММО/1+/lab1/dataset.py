import pandas as pd
import matplotlib.pyplot as plt

def part_matplotlib():
    # Импорт csv-файла, вывод данных для просмотра.
    df = pd.read_csv('../imdb.csv')
    print(df.head())
    print('\n----------------------------------------------\n')
    # Гистограмма частот по определенному столбцу (параметру).
    plt.hist(df['year'], bins = 20)
    plt.show()
    # Медиана и среднее значение параметра
    print(f"Медиана: {df['num_raters'].median()}")
    print(f"Среднее значение: {df['num_raters'].mean()}")
    print('\n----------------------------------------------\n')
    # Box Plot для выбранного параметра
    plt.boxplot(df['rating'])
    plt.show()
    # Применение метода .describe() к выбранному параметру.
    print("Описание:\n")
    print(df['name'].describe())
    print('\n----------------------------------------------\n')
    # Группировка данных по признаку, расчет и анализ по параметрам.
    print(f"Группировка по возрастным ограничениям:\n{df.groupby('movie_rated')['name'].count()}")
    print('\n----------------------------------------------\n')
    print(f"Распределение фильмов по жанру:\n{df.groupby('genres').size()}")
    print('\n----------------------------------------------\n')
    print(f"Средняя кол-во отзывов на фильм по жанру:\n{df.groupby('genres')['num_reviews'].mean()}")
    print('\n----------------------------------------------\n')
    print(f"Топ-5 фильмов по рейтингу:\n{df.groupby('name')['rating'].max().nlargest(5)}")
    print('\n----------------------------------------------\n')
    print(f"Распределение годов выпуска:\n{df.groupby('year').size()}")
    print('\n----------------------------------------------\n')
    print(f"Самые длинные фильмы:\n{df.groupby('run_length').size().sort_values(ascending=False).head(5)}")

if __name__ == '__main__':
    part_matplotlib()
import pandas as pd
import numpy as np
import seaborn as sns
from matplotlib import pyplot as plt
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import MinMaxScaler

chocolate_bars_data = pd.read_csv("Chocolate bar ratings 2022.csv")
print(chocolate_bars_data.head())

# 1) Выявите пропуски данных несколькими способами (визуальный, расчетный…)

# Тепловая карта

cols = chocolate_bars_data.columns[:]
colours = ['#eeeeee', '#ff0000']
sns.heatmap(chocolate_bars_data[cols].isnull(), cmap=sns.color_palette(colours))
plt.show()

# Проверка на наличие нулевых значений

print(chocolate_bars_data.isnull().any())

# Подсчет количество нулевых значений по столбцам

for col in chocolate_bars_data.columns:
    pct_missing = chocolate_bars_data[col].isnull().sum()
    print(f'{col} - {round(pct_missing)}')

# Подсчет процента нулевых значений по столбцам

for col in chocolate_bars_data.columns:
    pct_missing = np.mean(chocolate_bars_data[col].isnull())
    print(f'{col} - {round(pct_missing * 100)}%')

# 2) Исключите строки и столбцы с наибольшим количеством пропусков

chocolate_bars_data_after = chocolate_bars_data.drop(["Review Date"], axis=1)
print(chocolate_bars_data_after.head())
cols = chocolate_bars_data_after.columns[:]
colours = ['#eeeeee', '#ff0000']
sns.heatmap(chocolate_bars_data_after[cols].isnull(), cmap=sns.color_palette(colours))
plt.show()

# 3) Произведите замену оставшихся пропусков на логически обоснованные значения

chocolate_bars_data_after["Cocoa Percent (%)"] = chocolate_bars_data_after["Cocoa Percent (%)"].fillna(chocolate_bars_data_after["Cocoa Percent (%)"].mean())
print(chocolate_bars_data_after["Cocoa Percent (%)"])

# 4) Проверьте датасет на наличие выбросов, удалите найденные аномальные записи.

plt.boxplot(chocolate_bars_data_after['Cocoa Percent (%)'], patch_artist=True, vert=False)
plt.xlabel('Содержание какао (%)')
plt.title('Box Plot - Содержание какао')
plt.show()

def remove_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    return df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]

chocolate_bars_data_after = remove_outliers(chocolate_bars_data_after, 'Cocoa Percent (%)')
plt.boxplot(chocolate_bars_data_after['Cocoa Percent (%)'], patch_artist=True, vert=False)
plt.xlabel('Содержание какао (%)')
plt.title('Box Plot - Содержание какао')
plt.show()

# 5) Приведите параметры к числовому виду

label_encoder = LabelEncoder()

chocolate_bars_data_after.loc[:, 'Company (Manufacturer)'] = label_encoder.fit_transform(chocolate_bars_data_after['Company (Manufacturer)'])
chocolate_bars_data_after.loc[:, 'Company Location'] = label_encoder.fit_transform(chocolate_bars_data_after['Company Location'])
chocolate_bars_data_after.loc[:, 'Country of Bean Origin'] = label_encoder.fit_transform(chocolate_bars_data_after['Country of Bean Origin']).astype('int32')
chocolate_bars_data_after.loc[:, 'Specific Bean Origin or Bar Name'] = label_encoder.fit_transform(chocolate_bars_data_after['Specific Bean Origin or Bar Name']).astype('int32')
chocolate_bars_data_after.loc[:, 'Ingredients'] = label_encoder.fit_transform(chocolate_bars_data_after['Ingredients'])
chocolate_bars_data_after.loc[:, 'Most Memorable Characteristics'] = label_encoder.fit_transform(chocolate_bars_data_after['Most Memorable Characteristics']).astype('int32')

print(chocolate_bars_data_after.head())
chocolate_bars_data_after.to_csv("Chocolate_bars_cleaned.csv", index=False)

# 6) Проведите нормализацию данных

dataset_normalized = chocolate_bars_data_after.copy()
columns_to_normalize = dataset_normalized.columns
scaler = MinMaxScaler()
dataset_normalized[columns_to_normalize] = scaler.fit_transform(dataset_normalized[columns_to_normalize])
print(dataset_normalized.head())

# 7) Cохраните обработанный датасет

dataset_normalized.to_csv("Chocolate_bars_cleaned_normalized.csv", index=False)
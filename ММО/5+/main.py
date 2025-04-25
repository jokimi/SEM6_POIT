import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split

# 1. Загрузка данных и преобразование категориальных признаков
df = pd.read_csv('insurance.csv')

# Преобразование 'sex' и 'smoker' в числовые
df['sex'] = df['sex'].map({'male': 1, 'female': 0})
df['smoker'] = df['smoker'].map({'yes': 1, 'no': 0})
df['region'] = df['region'].map({'northwest': 1, 'southeast': 2, 'northeast': 3, 'southwest': 4})

# 2. Тепловая карта корреляций
corr_matrix = df.select_dtypes(include=['number']).corr()
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm')
plt.title('Матрица корреляций')
plt.show()

# 3. Диаграммы рассеяния
sns.pairplot(df, vars=['age', 'smoker', 'charges'])
plt.show()

# 4. Простая линейная регрессия (например, по признаку smoker)
feature = 'smoker'
X = df[[feature]].values
y = df['charges'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_simple = LinearRegression()
model_simple.fit(X_train, y_train)
y_test_pred = model_simple.predict(X_test)

# 5. График простой регрессии
plt.scatter(X_test, y_test, color='blue', label='Наблюдения')
plt.plot(X_test, y_test_pred, color='red', linewidth=2, label='Прогноз')
plt.xlabel('Возраст')
plt.ylabel('Затраты')
plt.title('Простая линейная регрессия (charges ~ smoker)')
plt.legend()
plt.show()

# 6. Оценка качества простой модели
print("Модель простой линейной регрессии:")
print("R²:", r2_score(y_test, y_test_pred))
print("MSE:", mean_squared_error(y_test, y_test_pred))
print("MAE:", mean_absolute_error(y_test, y_test_pred))
print()

# 7. Множественная линейная регрессия
features = ['age', 'bmi', 'children', 'sex', 'smoker']
X_multi = df[features].values
y_multi = df['charges'].values

X_train_multi, X_test_multi, y_train_multi, y_test_multi = train_test_split(
    X_multi, y_multi, test_size=0.2, random_state=42
)

model_multi = LinearRegression()
model_multi.fit(X_train_multi, y_train_multi)
y_test_pred_multi = model_multi.predict(X_test_multi)

# 8. 3D-визуализация двух признаков из модели
fig = plt.figure(figsize=(10, 6))
ax = fig.add_subplot(111, projection='3d')
ax.scatter(X_test_multi[:, 0], X_test_multi[:, 1], y_test_multi, color='blue', label='Наблюдения')
ax.scatter(X_test_multi[:, 0], X_test_multi[:, 1], y_test_pred_multi, color='red', label='Прогноз')

ax.set_xlabel('Возраст')
ax.set_ylabel('BMI')
ax.set_zlabel('Затраты')
ax.set_title('Множественная линейная регрессия')
ax.legend()
plt.show()

# 9. Оценка качества модели с несколькими признаками
print("Модель множественной линейной регрессии:")
print("R²:", r2_score(y_test_multi, y_test_pred_multi))
print("MSE:", mean_squared_error(y_test_multi, y_test_pred_multi))
print("MAE:", mean_absolute_error(y_test_multi, y_test_pred_multi))

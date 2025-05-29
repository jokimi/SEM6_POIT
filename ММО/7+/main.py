import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import matplotlib.patches as mpatches
import time

# 1. Загрузка датасета breast_cancer

X, y = load_breast_cancer(return_X_y=True, as_frame=True)
print(f"Размерность данных: {X.shape}")
print(f"Количество классов: {len(np.unique(y))}\n")

# 2. Анализ весов компонент с нормализацией и без

# Без нормализации
pca = PCA(n_components=2)
pca.fit(X)
weights_no_scale = pca.components_[0]

# С нормализацией
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
pca_scaled = PCA(n_components=2)
pca_scaled.fit(X_scaled)
weights_scaled = pca_scaled.components_[0]

plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
plt.bar(range(len(weights_no_scale)), weights_no_scale)
plt.title('Веса первой компоненты (без нормализации)')
plt.xlabel('Признаки')
plt.ylabel('Вес')

plt.subplot(1, 2, 2)
plt.bar(range(len(weights_scaled)), weights_scaled)
plt.title('Веса первой компоненты (с нормализацией)')
plt.xlabel('Признаки')
plt.ylabel('Вес')
plt.tight_layout()
plt.show()

# 3. Визуализация распределения классов

# Определяем цветовую схему для классов
class_colors = {0: 'red', 1: 'blue'}  # Четкие контрастные цвета
class_names = {0: 'Злокачественная опухоль', 1: 'Доброкачественная опухоль'}  # Пояснительные названия

X_pca = pca.transform(X)
X_pca_scaled = pca_scaled.transform(X_scaled)

plt.figure(figsize=(14, 6))

# График без нормализации
plt.subplot(1, 2, 1)
# Применяем наши цвета через маппинг
scatter1 = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=[class_colors[label] for label in y], alpha=0.6)
plt.title('PCA без нормализации')
plt.xlabel('Первая главная компонента')
plt.ylabel('Вторая главная компонента')

# Создаем легенду
legend_patches = [mpatches.Patch(color=class_colors[cls], label=class_names[cls])
                 for cls in class_names]
plt.legend(handles=legend_patches, title='Классы')

# График с нормализацией
plt.subplot(1, 2, 2)
# Используем те же цвета
scatter2 = plt.scatter(X_pca_scaled[:, 0], X_pca_scaled[:, 1], c=[class_colors[label] for label in y], alpha=0.6)
plt.title('PCA с нормализацией')
plt.xlabel('Первая главная компонента')
plt.ylabel('Вторая главная компонента')
plt.legend(handles=legend_patches, title='Классы')  # Та же легенда

plt.tight_layout()
plt.show()

# 4. Обучение модели SVM без PCA

# Разделение данных
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Обучение модели
start_time = time.time()
svm = SVC(kernel='rbf')
svm.fit(X_train, y_train)
train_time = time.time() - start_time

# Оценка модели
y_pred = svm.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Точность SVM без PCA: {accuracy:.4f}")
print(f"Время обучения: {train_time:.4f} сек\n")

# 5. Обучение модели SVM с PCA (сохранение 90% дисперсии)

# Определение оптимального числа компонент
pca = PCA().fit(X_scaled)
plt.figure(figsize=(8, 6))
plt.plot(np.cumsum(pca.explained_variance_ratio_))
plt.xlabel('Количество компонент')
plt.ylabel('Накопленная дисперсия')
plt.axhline(y=0.9, color='r', linestyle='--')
plt.title('Накопленная дисперсия от количества компонент')
plt.show()

# Находим количество компонент для 90% дисперсии
n_components = np.argmax(np.cumsum(pca.explained_variance_ratio_) >= 0.9) + 1
print(f"Количество компонент для 90% дисперсии: {n_components}")

# Применение PCA
pca = PCA(n_components=n_components)
X_pca = pca.fit_transform(X_scaled)

# Разделение данных после PCA
X_train_pca, X_test_pca, y_train_pca, y_test_pca = train_test_split(
    X_pca, y, test_size=0.3, random_state=42)

# Обучение модели
start_time_pca = time.time()
svm_pca = SVC(kernel='rbf')
svm_pca.fit(X_train_pca, y_train_pca)
train_time_pca = time.time() - start_time_pca

# Оценка модели
y_pred_pca = svm_pca.predict(X_test_pca)
accuracy_pca = accuracy_score(y_test_pca, y_pred_pca)

print(f"Точность SVM с PCA: {accuracy_pca:.4f}")
print(f"Время обучения: {train_time_pca:.4f} сек")
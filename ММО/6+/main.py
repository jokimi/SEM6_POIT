import pandas as pd
from scipy.cluster.hierarchy import linkage, dendrogram
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
import os

os.environ['LOKY_MAX_CPU_COUNT'] = '4'

# 1. Из датасета выберите наиболее важные параметры, характеризующие цель исследования
#    и сформируйте из них матрицу X.

data = pd.read_csv('Country-data.csv')
X = data[['life_expec', 'income', 'gdp']]

# 2. Проверьте Х на пропуски и закодируйте категориальные данные, если это необходимо.

print(X.isnull().sum())

# 3. Нормализуйте значения в матрице Х функцией MinMaxScaler().

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# 4. C помощью метода локтя определите оптимальное количество кластеров и разделите
#    данные на кластеры методом K-means.

inertia = []
k_values = range(2, 11)
for k in k_values:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertia.append(kmeans.inertia_)

### Визуализация метода локтя

plt.plot(k_values, inertia, 'bx-')
plt.xlabel('Number of Clusters')
plt.ylabel('WCSS')
plt.title('Elbow Method')
plt.show()

### Выбор оптимального количества кластеров
optimal_k = 4

### Кластеризация методом K-means
kmeans = KMeans(n_clusters=optimal_k, random_state=42)
kmeans_labels = kmeans.fit_predict(X_scaled)

# 5. Визуализируйте результаты кластеризации, выбрав для визуализации два параметра из матрицы Х.

param1 = 'life_expec'
param2 = 'income'
plt.scatter(X[param1], X[param2], c=kmeans_labels)
plt.xlabel(param1)
plt.ylabel(param2)
plt.title('K-means Clustering')
plt.show()

# 6. Разделите данные на кластеры методом иерархической кластеризации, выберите с
#    помощью дендрограммы оптимальное количество кластеров.

hierarchical = AgglomerativeClustering(n_clusters=optimal_k)
hierarchical_labels = hierarchical.fit_predict(X_scaled)

# 7. Визуализируйте результаты кластеризации методом иерархической кластеризации.

linkage_matrix = linkage(X_scaled, method='ward')  # Вычисление матрицы связей
dendrogram(linkage_matrix)
plt.xlabel(param1)
plt.ylabel(param2)
plt.title('Hierarchical Clustering Dendrogram')
plt.show()

# 8. Оцените качество кластеризации методами K-means и иерархической кластеризации,
#    рассчитав пару метрик качества кластеризации (модуль sklearn.metrics).

silhouette_kmeans = silhouette_score(X_scaled, kmeans_labels)
silhouette_hierarchical = silhouette_score(X_scaled, hierarchical_labels)
print(f'Silhouette Score (K-means): {silhouette_kmeans}')
print(f'Silhouette Score (Hierarchical): {silhouette_hierarchical}')

# 9. Из датасета выберите любой конкретный объект и визуализируйте этот объект в виде точки
#    отличного цвета и размера на графике кластеров.

chosen_country = 'Brazil'
chosen_country_data = X.loc[data['country'] == chosen_country]
chosen_country_cluster = kmeans.predict(scaler.transform(chosen_country_data))
plt.scatter(X[param1], X[param2], c=kmeans_labels)
plt.scatter(chosen_country_data[param1], chosen_country_data[param2], c='red', s=100, label=chosen_country)
plt.xlabel(param1)
plt.ylabel(param2)
plt.title('K-means Clustering with Chosen Country')
plt.legend()
plt.show()
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.tree import export_graphviz
import graphviz

# 1. Выберите любой доступный датасет, подходящий для бинарной классификации.

data = pd.read_csv("Credit_card.csv")

# 2. Проанализируйте исходные данные, при необходимости заполните пропуски
#    или удалите неважную информацию. Категориальные признаки замените на числовые.

# Анализ пропущенных значений
missing_values = data.isnull().sum()

# Заполнение пропущенных значений
imputer = SimpleImputer(strategy="most_frequent")
data_filled = pd.DataFrame(imputer.fit_transform(data), columns=data.columns)

# Работа с категориальными признаками
label_encoder = LabelEncoder()
categorical_columns = data_filled.select_dtypes(include=["object"]).columns
for col in categorical_columns:
    data_filled[col] = label_encoder.fit_transform(data_filled[col])

# Удаление ненужной информации
data_processed = data_filled.drop(columns=["Ind_ID", "EMAIL_ID"])

# 3. Выделите из данных вектор меток У и матрицу признаков Х.

# Выделение вектора меток y (целевой переменной)
y = data_processed["Car_Owner"]

# Выделение матрицы признаков X
X = data_processed.drop(columns=["Car_Owner"])
print(X.head())
print(y.head())

# 4. Разделите набор данных на обучающую и тестовую выборки.

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=17)
print("Inputs X (train/test):", X_train.shape, X_test.shape)
print("Outputs Y (train/test):", y_train.shape, y_test.shape)

# 5. На обучающей выборке обучите модель дерева решений и k-ближайших соседей, оцените точность моделей.

# Обучение и оценка точности модели дерева решений
tree = DecisionTreeClassifier(max_depth=5, random_state=0)
tree.fit(X_train, y_train)
print("Правильность на обучающем наборе (Decision Tree): {:.3f}".format(tree.score(X_train, y_train)))
print("Правильность на тестовом наборе (Decision Tree): {:.3f}".format(tree.score(X_test, y_test)))

# Обучение и оценка точности модели k-ближайших соседей
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
print("Правильность на обучающем наборе (KNN): {:.3f}".format(knn.score(X_train, y_train)))
print("Правильность на тестовом наборе (KNN): {:.3f}".format(knn.score(X_test, y_test)))

# Обучение и оценка точности модели случайного леса
rf = RandomForestClassifier(random_state=0)
rf.fit(X_train, y_train)
print("Правильность на обучающем наборе (Random Forest): {:.3f}".format(rf.score(X_train, y_train)))
print("Правильность на тестовом наборе (Random Forest): {:.3f}".format(rf.score(X_test, y_test)))

# 6. Рассчитайте матрицу ошибок (confusion matrix) и метрики качества.

# Расчеты для модели дерева решений
y_pred_tree = tree.predict(X_test)
conf_matrix_tree = confusion_matrix(y_test, y_pred_tree)
print("\nМатрица ошибок (Decision Tree):\n", conf_matrix_tree)
print("Accuracy (Decision Tree): {:.3f}".format(accuracy_score(y_test, y_pred_tree)))
print("Precision (Decision Tree): {:.3f}".format(precision_score(y_test, y_pred_tree)))
print("Recall (Decision Tree): {:.3f}".format(recall_score(y_test, y_pred_tree)))

# Расчеты для модели k-ближайших соседей
y_pred_knn = knn.predict(X_test)
conf_matrix_knn = confusion_matrix(y_test, y_pred_knn)
print("\nМатрица ошибок (KNN):\n", conf_matrix_knn)
print("Accuracy (KNN): {:.3f}".format(accuracy_score(y_test, y_pred_knn)))
print("Precision (KNN): {:.3f}".format(precision_score(y_test, y_pred_knn)))
print("Recall (KNN): {:.3f}".format(recall_score(y_test, y_pred_knn)))

# Расчеты для модели случайного леса
y_pred_rf = rf.predict(X_test)
conf_matrix_rf = confusion_matrix(y_test, y_pred_rf)
print("\nМатрица ошибок (Random Forest):\n", conf_matrix_rf)
print("Accuracy (Random Forest): {:.3f}".format(accuracy_score(y_test, y_pred_rf)))
print("Precision (Random Forest): {:.3f}".format(precision_score(y_test, y_pred_rf)))
print("Recall (Random Forest): {:.3f}".format(recall_score(y_test, y_pred_rf)))

# 7. Улучшите модель путем подбора наилучших гиперпараметров модели.

# Поиск наилучших параметров для модели дерева решений
param_grid_tree = {'max_depth': [3, 5, 7, 10]}
tree = DecisionTreeClassifier(random_state=0)
grid_search_tree = GridSearchCV(tree, param_grid_tree, cv=5)
grid_search_tree.fit(X_train, y_train)
print("Наилучшие параметры для дерева решений:", grid_search_tree.best_params_)

# Поиск наилучших параметров для модели k-ближайших соседей
param_grid_knn = {'n_neighbors': [3, 5, 7, 10]}
knn = KNeighborsClassifier()
grid_search_knn = GridSearchCV(knn, param_grid_knn, cv=5)
grid_search_knn.fit(X_train, y_train)
print("Наилучшие параметры для KNN:", grid_search_knn.best_params_)

# Поиск наилучших параметров для модели случайного леса

param_grid_rf = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 7, 10],
    'min_samples_split': [2, 5, 10]
}
rf = RandomForestClassifier(random_state=0)
grid_search_rf = GridSearchCV(rf, param_grid_rf, cv=5)
grid_search_rf.fit(X_train, y_train)
print("Наилучшие параметры для случайного леса:", grid_search_rf.best_params_)

# 8. Оцените точность модели после улучшения, сравните с точностью до улучшения.

best_tree = grid_search_tree.best_estimator_
print("Правильность на тестовом наборе для дерева решений:", best_tree.score(X_test, y_test))
best_knn = grid_search_knn.best_estimator_
print("Правильность на тестовом наборе для KNN:", best_knn.score(X_test, y_test))
best_rf = grid_search_rf.best_estimator_
print("Правильность на тестовом наборе для случайного леса:", best_rf.score(X_test, y_test))

# 9. Визуализируйте полученную модель дерева решений.

export_graphviz(
    best_tree,
    out_file="tree.dot",
    feature_names=X.columns,
    class_names=['Not Car Owner', 'Car Owner'],
    filled=True,
    rounded=True
)
with open("tree.dot") as f:
    dot_graph = f.read()
graphviz.Source(dot_graph)

# dot -Tpng tree.dot -o tree.png
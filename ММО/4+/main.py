import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import precision_score, recall_score, confusion_matrix
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import roc_curve, RocCurveDisplay
import matplotlib.pyplot as plt

data = pd.read_csv("Credit_card.csv")

imputer = SimpleImputer(strategy="most_frequent")
data_filled = pd.DataFrame(imputer.fit_transform(data), columns=data.columns)

label_encoder = LabelEncoder()
categorical_columns = data_filled.select_dtypes(include=["object"]).columns
for col in categorical_columns:
    data_filled[col] = label_encoder.fit_transform(data_filled[col])

y = data_filled["Car_Owner"]
X = data_filled.drop(columns=["Car_Owner"])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 1. Обучите на своих данных модель логистической регрессии LogisticRegression.

model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# Рассчитайте точность на обучающих и тестовых данных

train_accuracy = model.score(X_train_scaled, y_train)
test_accuracy = model.score(X_test_scaled, y_test)
print("Правильность на обучающем наборе: {:.2f}".format(train_accuracy))
print("Правильность на тестовом наборе: {:.2f}".format(test_accuracy))

# Измените в модели параметр регуляризации С
for C in [100, 0.01]:
    model = LogisticRegression(C=C, max_iter=10000, solver='saga')
    model.fit(X_train_scaled, y_train)
    train_accuracy = model.score(X_train_scaled, y_train)
    test_accuracy = model.score(X_test_scaled, y_test)
    print("Правильность на обучающем наборе (C={}): {:.2f}".format(C, train_accuracy))
    print("Правильность на тестовом наборе (C={}): {:.2f}".format(C, test_accuracy))

# Добавьте в модель L2-регуляризацию

model = LogisticRegression(penalty='l2', C=0.1)
model.fit(X_train_scaled, y_train)

# Рассчитайте метрики качества (accuracy, precision, recall) и матрицу ошибок для наилучшей модели

y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)
print("Метрика accuracy:", accuracy)
print("Метрика precision:", precision)
print("Метрика recall:", recall)
print("Матрица ошибок:")
print(conf_matrix)

# 2. Обучите на своих данных модель метода опорных векторов SVC.

svc_model = SVC()
svc_model.fit(X_train_scaled, y_train)

# Рассчитайте точность на обучающих и тестовых данных

train_accuracy_svc = svc_model.score(X_train_scaled, y_train)
test_accuracy_svc = svc_model.score(X_test_scaled, y_test)
print("Точность модели SVC на обучающем наборе: {:.2f}".format(train_accuracy_svc))
print("Точность модели SVC на тестовом наборе: {:.2f}".format(test_accuracy_svc))

# При помощи метода GridSearchCV найдите наилучшую комбинацию параметров

SVC_params = {"C": [0.1, 1, 10], "gamma": [0.2, 0.6, 1]}
SVC_grid = GridSearchCV(SVC(), SVC_params, cv=5, n_jobs=-1)
SVC_grid.fit(X_train_scaled, y_train)
print("Наилучшая точность модели SVC:", SVC_grid.best_score_)
print("Наилучшие параметры:", SVC_grid.best_params_)
best_svc_model = SVC(**SVC_grid.best_params_)
best_svc_model.fit(X_train_scaled, y_train)

# Выведите точность этой модели на обучающих и тестовых данных

train_accuracy_best_svc = best_svc_model.score(X_train_scaled, y_train)
test_accuracy_best_svc = best_svc_model.score(X_test_scaled, y_test)
print("Точность лучшей модели SVC на обучающем наборе: {:.2f}".format(train_accuracy_best_svc))
print("Точность лучшей модели SVC на тестовом наборе: {:.2f}".format(test_accuracy_best_svc))

# Прогнозы для тестового набора данных

y_pred_svc = best_svc_model.predict(X_test_scaled)

# Рассчитайте метрики качества (accuracy, precision, recall) и матрицу
# ошибок для наилучшей модели метода опорных векторов

precision_svc = precision_score(y_test, y_pred_svc)
recall_svc = recall_score(y_test, y_pred_svc)
accuracy_svc = accuracy_score(y_test, y_pred_svc)
conf_matrix_svc = confusion_matrix(y_test, y_pred_svc)
print("Метрика accuracy для лучшей модели SVC:", accuracy_svc)
print("Метрика precision для лучшей модели SVC:", precision_svc)
print("Метрика recall для лучшей модели SVC:", recall_svc)
print("Матрица ошибок для лучшей модели SVC:")
print(conf_matrix_svc)

# 3. Обучите на этом же датасете модели дерева решений и K-ближайших соседей. Выведите их точность на
#    обучающих и тестовых данных

dt_model = DecisionTreeClassifier()
dt_model.fit(X_train_scaled, y_train)

train_accuracy_dt = dt_model.score(X_train_scaled, y_train)
test_accuracy_dt = dt_model.score(X_test_scaled, y_test)
print("Точность модели дерева решений на обучающем наборе: {:.2f}".format(train_accuracy_dt))
print("Точность модели дерева решений на тестовом наборе: {:.2f}".format(test_accuracy_dt))

knn_model = KNeighborsClassifier()
knn_model.fit(X_train_scaled, y_train)

train_accuracy_knn = knn_model.score(X_train_scaled, y_train)
test_accuracy_knn = knn_model.score(X_test_scaled, y_test)
print("Точность модели K-ближайших соседей на обучающем наборе: {:.2f}".format(train_accuracy_knn))
print("Точность модели K-ближайших соседей на тестовом наборе: {:.2f}".format(test_accuracy_knn))

# 4. Постройте в одних осях четыре ROC-кривые для 4-х обученных моделей.

ax = plt.gca()
logistic_disp = RocCurveDisplay.from_estimator(model, X_test_scaled, y_test, ax=ax, name='Logistic Regression')
svc_disp = RocCurveDisplay.from_estimator(best_svc_model, X_test_scaled, y_test, ax=ax, name='Support Vector Machine')
dt_disp = RocCurveDisplay.from_estimator(dt_model, X_test_scaled, y_test, ax=ax, name='Decision Tree')
knn_disp = RocCurveDisplay.from_estimator(knn_model, X_test_scaled, y_test, ax=ax, name='K-Nearest Neighbors')
plt.legend(loc="lower right")
plt.show()
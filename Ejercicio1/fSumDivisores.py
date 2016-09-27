# Modulo que suma los divisores propios positivos de un numero pasado por parametro
# input: numero entero
# output: sumatorio de los divisores propios, lista de divisores

def sum_divisores(n):
    sumatorio=0
    lista=[]
    for i in range(1,n):
        if n%i==0:
            sumatorio=sumatorio+i
            lista.append(i)

    return sumatorio,lista
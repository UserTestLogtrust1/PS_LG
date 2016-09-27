import os
import fSumDivisores

# limpiar terminal
os.system('clear')

listnum = raw_input('Introduzca los numeros separados por ",": ').split(',')
number = [int(n) for n in listnum if n.isdigit()]

# recorrer lista de numeros
for n in number:
    sumatorio,lista = fSumDivisores.sum_divisores(n)
    
    # Perfecto (sumatorio = suma divisores propios)
    if sumatorio==n:
        print n,'--> PERFECTO\nLista de divisores propios: ',lista,'\nSuma = ',sumatorio,'\n'

    # Abundante (sumatorio > suma divisores propios)
    elif sumatorio > n:
        print n,'--> ABUNDANTE\nLista de divisores propios: ',lista,'\nSuma = ',sumatorio,'\n'

    # Defectivo (sumatorio < suma divisores propios)
    elif sumatorio < n:
        print n,'--> DEFECTIVO\nLista de divisores propios: ',lista,'\nSuma = ',sumatorio,'\n'​

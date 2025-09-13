import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json

# Data for the tables
data = [
    {"table": "Products", "fields": ["id (PK)", "name", "description", "price", "quantity", "category_id", "created_at", "updated_at"], "relationships": []}, 
    {"table": "Orders", "fields": ["id (PK)", "user_id (FK)", "order_date", "status", "total_amount", "created_at", "updated_at"], "relationships": ["Users.id"]}, 
    {"table": "Order_Items", "fields": ["id (PK)", "order_id (FK)", "product_id (FK)", "quantity", "price", "subtotal"], "relationships": ["Orders.id", "Products.id"]}, 
    {"table": "Users", "fields": ["id (PK)", "username", "email", "password_hash", "role", "created_at", "updated_at"], "relationships": []}, 
    {"table": "Invoices", "fields": ["id (PK)", "order_id (FK)", "invoice_number", "invoice_date", "due_date", "status", "total_amount", "tax_amount", "created_at"], "relationships": ["Orders.id"]}
]

# Define positions for tables
positions = {
    "Users": (0, 8),
    "Orders": (5, 6),
    "Products": (10, 8),
    "Order_Items": (5, 2),
    "Invoices": (0, 4)
}

# Create figure
fig = go.Figure()

# Colors for different tables
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C']

# Draw tables as rectangles and add field text
for i, table_data in enumerate(data):
    table_name = table_data["table"]
    fields = table_data["fields"]
    x, y = positions[table_name]
    
    # Add rectangle for table
    fig.add_shape(
        type="rect",
        x0=x-1.5, y0=y-len(fields)*0.3-0.5,
        x1=x+1.5, y1=y+0.5,
        line=dict(color="black", width=2),
        fillcolor=colors[i % len(colors)],
        opacity=0.3
    )
    
    # Add table name as title
    fig.add_annotation(
        x=x, y=y+0.2,
        text=f"<b>{table_name}</b>",
        showarrow=False,
        font=dict(size=14, color="black"),
        bgcolor="white",
        bordercolor="black",
        borderwidth=1
    )
    
    # Add fields
    for j, field in enumerate(fields):
        # Truncate field names to fit 15 character limit
        display_field = field[:15] if len(field) > 15 else field
        fig.add_annotation(
            x=x, y=y-0.3*(j+1),
            text=display_field,
            showarrow=False,
            font=dict(size=10, color="black"),
            bgcolor="white" if "(PK)" in field or "(FK)" in field else None,
            bordercolor="black" if "(PK)" in field or "(FK)" in field else None,
            borderwidth=1 if "(PK)" in field or "(FK)" in field else 0
        )

# Draw relationship lines
relationships = [
    ("Users", "Orders"),  # Users.id -> Orders.user_id
    ("Orders", "Order_Items"),  # Orders.id -> Order_Items.order_id
    ("Products", "Order_Items"),  # Products.id -> Order_Items.product_id
    ("Orders", "Invoices")  # Orders.id -> Invoices.order_id
]

for from_table, to_table in relationships:
    x1, y1 = positions[from_table]
    x2, y2 = positions[to_table]
    
    # Draw line
    fig.add_shape(
        type="line",
        x0=x1, y0=y1-2,
        x1=x2, y1=y2+0.5,
        line=dict(color="black", width=2),
    )
    
    # Add arrow
    fig.add_annotation(
        x=x2, y=y2+0.5,
        ax=x1, ay=y1-2,
        arrowhead=2,
        arrowsize=1,
        arrowwidth=2,
        arrowcolor="black",
        showarrow=True,
        text=""
    )

# Update layout
fig.update_layout(
    title="Inventory & Billing System Schema",
    showlegend=False,
    xaxis=dict(visible=False),
    yaxis=dict(visible=False),
    plot_bgcolor='white',
    annotations=[ann for ann in fig.layout.annotations]
)

# Set axis ranges to fit all elements
fig.update_xaxes(range=[-3, 13])
fig.update_yaxes(range=[0, 10])

# Save the chart
fig.write_image("database_schema.png", width=1200, height=800)